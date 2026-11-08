import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { SectionLink } from './components/ui/SectionLink';
import { MobileMenu } from './components/MobileMenu';
import { buildNavGroups, type NavItem as SiteNavItem } from './lib/navigation';
import { ui } from './lib/strings';
import { IconIndex } from './components/ui/Icons';

export type Locale = 'pl' | 'en' | 'nl';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`${visible ? 'reveal-visible' : 'reveal-hidden'} ${className ?? ''}`}>
      {children}
    </div>
  );
};

type NavItem = { id: string; label: string; group?: SiteNavItem['group']; index?: string };

export { SectionLink };

export const LanguageSwitcher: React.FC<{ locale: Locale; onChange: (loc: Locale) => void }> = ({ locale, onChange }) => {
  const langs: Locale[] = ['pl', 'en', 'nl'];
  const labels: Record<Locale, string> = {
    pl: 'Wybór języka',
    en: 'Language selection',
    nl: 'Taalkeuze'
  };
  return (
    <div role="group" aria-label={labels[locale]} className="flex items-center border border-surface-border bg-background-deep/60">
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          data-lang={l}
          aria-pressed={locale === l}
          onClick={() => onChange(l)}
          className={`min-w-[2.1rem] sm:min-w-[2.4rem] h-8 px-1.5 sm:px-2 font-mono text-[0.72rem] tracking-[0.12em] transition-colors ${
            locale === l
              ? 'bg-amber-500 text-background-default font-semibold'
              : 'text-neutral-300 hover:text-neutral-50 hover:bg-surface-card'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export const SectionHeading: React.FC<{ id?: string; title: string; subtitle?: string; index?: string; code?: string }> = ({
  id,
  title,
  subtitle,
  index,
  code
}) => (
  <header className="mb-8 md:mb-10">
    <div className="section-rail" aria-hidden="true">
      {index && <span className="section-rail__index">{index}</span>}
      <span className="section-rail__line measure" />
      {code && <span className="section-rail__code">{code}</span>}
    </div>
    <h2 id={id} className="section-title">
      {title}
    </h2>
    {subtitle && <p className="mt-3 max-w-3xl text-neutral-300 md:text-lg">{subtitle}</p>}
  </header>
);

export const SkillTag: React.FC<{ label: string }> = ({ label }) => <span className="tag">{label}</span>;

export const renderFormatted = (text: string) => {
  const segments = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return segments.map((segment, idx) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return (
        <strong key={`${segment}-${idx}`} className="text-neutral-50">
          {segment.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${segment}-${idx}`}>{segment}</React.Fragment>;
  });
};

type AboutCardProps = {
  title: string;
  icon?: string;
  items: string[];
  cta?: { label: string; href: string } | null;
};

type ProjectMetric = { label: string; value: string };
type ProjectImage = { src: string; alt: string };
type ProjectCtaVariant = 'primary' | 'secondary' | 'ghost';
type ProjectCta = { label: string; href: string; variant?: ProjectCtaVariant | string };

export const AboutCard: React.FC<AboutCardProps> = ({ title, icon, items, cta }) => (
  <article className="panel panel--interactive h-full flex flex-col" data-spotlight>
    <header className="flex items-start gap-3 p-5 pb-3">
      {icon && (
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center border border-surface-line bg-background-deep/70 text-xl leading-none"
        >
          <span className="icon-emoji">{icon}</span>
        </span>
      )}
      <h3 className="hud-title text-lg leading-tight pt-1">{title}</h3>
    </header>
    <ul className="px-5 pb-5 space-y-2.5 text-neutral-200 text-[0.95rem]" role="list">
      {items.map((item, idx) => (
        <li key={`${title}-${idx}`} className="flex gap-2.5 leading-relaxed">
          <span aria-hidden="true" className="mt-[0.6rem] h-1 w-2.5 shrink-0 bg-primary-400" />
          <span>{renderFormatted(item)}</span>
        </li>
      ))}
    </ul>
    {cta?.href && cta?.label && (
      <div className="px-5 pb-5 mt-auto">
        <a href={cta.href} aria-label={`${title}: ${cta.label}`} className="btn btn--secondary btn--sm">
          {cta.label}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    )}
  </article>
);

export const ProjectCard: React.FC<{
  locale: Locale;
  name: string;
  tagline?: string;
  summary?: string;
  challenge?: string;
  approach?: string[];
  outcome?: string;
  metrics?: ProjectMetric[];
  skills?: string[];
  image?: ProjectImage;
  ctas?: ProjectCta[];
  audio?: string;
}> = ({
  locale,
  name,
  tagline,
  summary,
  challenge,
  approach = [],
  outcome,
  metrics = [],
  skills = [],
  image,
  ctas = [],
  audio
}) => {
  const sectionLabels: Record<Locale, { challenge: string; approach: string; outcome: string; metrics: string; skills: string }> = {
    pl: {
      challenge: 'Wyzwanie',
      approach: 'Podejście',
      outcome: 'Rezultat',
      metrics: 'Kluczowe wskaźniki',
      skills: 'Kompetencje'
    },
    en: {
      challenge: 'Challenge',
      approach: 'Approach',
      outcome: 'Outcome',
      metrics: 'Key metrics',
      skills: 'Capabilities'
    },
    nl: {
      challenge: 'Uitdaging',
      approach: 'Aanpak',
      outcome: 'Resultaat',
      metrics: 'Kerncijfers',
      skills: 'Competenties'
    }
  };

  const ctaVariants: Record<ProjectCtaVariant, string> = {
    primary: 'btn btn--primary btn--sm',
    secondary: 'btn btn--secondary btn--sm',
    ghost: 'btn btn--ghost btn--sm'
  };

  const labels = sectionLabels[locale];

  const normalizeVariant = (variant?: string): ProjectCtaVariant => {
    if (variant === 'primary' || variant === 'secondary' || variant === 'ghost') {
      return variant;
    }
    return 'secondary';
  };

  const renderCtaClass = (variant?: string) => {
    const key = normalizeVariant(variant);
    return ctaVariants[key];
  };

  const isExternal = (href: string) => /^https?:/i.test(href);

  return (
    <article className="panel panel--interactive flex flex-col h-full" data-spotlight>
      <figure className="tile__media">
        {image?.src ? (
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="blueprint text-neutral-300 text-sm">
            {locale === 'pl' ? 'Wizualizacja w przygotowaniu' : locale === 'en' ? 'Visual coming soon' : 'Visual volgt binnenkort'}
          </div>
        )}
      </figure>
      <div className="flex flex-col gap-4 p-5 flex-1">
        <header>
          <h3 className="hud-title text-xl">{name}</h3>
          {tagline && <p className="text-sand-400 mt-1 text-sm">{tagline}</p>}
          {summary && <p className="text-neutral-200 mt-2">{summary}</p>}
        </header>

        {metrics.length > 0 && (
          <section aria-label={labels.metrics}>
            <ul className="flex flex-wrap gap-2" role="list">
              {metrics.map((metric) => (
                <li key={`${metric.label}-${metric.value}`}>
                  <span className="inline-flex flex-col px-3 py-2 border border-surface-border bg-background-deep/60 text-neutral-100 min-w-[120px]">
                    <span className="hud-label">{metric.label}</span>
                    <span className="font-heading text-lg font-semibold text-neutral-50">{metric.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Audio Player dla projektu */}
        {audio && <AudioPlayer src={audio} title={name} type="audio" />}

        <div className="space-y-4 text-neutral-200">
          {challenge && (
            <section>
              <h4 className="hud-label">{labels.challenge}</h4>
              <p className="mt-1 leading-relaxed">{challenge}</p>
            </section>
          )}
          {approach.length > 0 && (
            <section>
              <h4 className="hud-label">{labels.approach}</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1" role="list">
                {approach.map((step, index) => (
                  <li key={`${name}-approach-${index}`}>{step}</li>
                ))}
              </ul>
            </section>
          )}
          {outcome && (
            <section>
              <h4 className="hud-label">{labels.outcome}</h4>
              <p className="mt-1 leading-relaxed">{outcome}</p>
            </section>
          )}
        </div>

        {skills.length > 0 && (
          <section aria-label={labels.skills}>
            <ul className="flex flex-wrap gap-2" role="list">
              {skills.map((skill) => (
                <li key={skill}>
                  <SkillTag label={skill} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2 mt-auto">
            {ctas.map((cta) => {
              const variantClass = renderCtaClass(cta.variant);
              const external = isExternal(cta.href);
              return (
                <a
                  key={`${name}-${cta.label}`}
                  href={cta.href}
                  className={variantClass}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={`${name}: ${cta.label}`}
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

type MetricCounterProps = {
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  locale: Locale;
};

export const MetricCounter: React.FC<MetricCounterProps> = ({ value, suffix = '', label, description, locale }) => {
  const [displayValue, setDisplayValue] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 900;

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(value * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const formattedValue = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: Number.isInteger(value) ? 0 : 1
    });
    return formatter.format(Number.isFinite(displayValue) ? displayValue : value);
  }, [displayValue, locale, value]);

  return (
    <article
      className="panel panel--sm h-full p-5"
      data-spotlight
      aria-label={`${label}: ${formattedValue}${suffix}`}
      aria-live="polite"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-heading text-4xl font-semibold text-amber-400 tabular-nums" aria-hidden="true">
          {formattedValue}
        </span>
        {suffix && (
          <span className="font-mono text-lg text-sand-400" aria-hidden="true">
            {suffix.trim()}
          </span>
        )}
      </div>
      <div className="measure mt-3 opacity-70" aria-hidden="true" />
      <p className="mt-3 text-neutral-100 font-medium">{label}</p>
      {description ? <p className="mt-2 text-sm text-neutral-300">{description}</p> : null}
      <span className="sr-only">{`${formattedValue}${suffix}`}</span>
    </article>
  );
};

type WorkflowPhase = {
  id: string;
  name: string;
  summary: string;
  deliverables?: string[];
  icon?: string;
};

export const WorkflowDiagram: React.FC<{ phases: WorkflowPhase[] }> = ({ phases }) => {
  const diagramId = useId();

  if (!phases.length) {
    return null;
  }

  return (
    <section aria-labelledby={`${diagramId}-title`} className="space-y-4">
      <h4 id={`${diagramId}-title`} className="sr-only">
        Workflow
      </h4>
      <ol className="grid gap-3 md:grid-cols-2" role="list">
        {phases.map((phase, index) => (
          <li key={phase.id} className="panel panel--inset panel--sm p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center border border-amber-500/50 bg-amber-500/10 font-heading text-lg text-amber-300"
              >
                {phase.icon ?? index + 1}
              </span>
              <div>
                <p className="hud-label">{`Phase ${String(index + 1).padStart(2, '0')}`}</p>
                <h5 className="font-heading text-lg font-semibold text-neutral-50">{phase.name}</h5>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-200">{phase.summary}</p>
            {phase.deliverables && phase.deliverables.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                {phase.deliverables.map((deliverable) => (
                  <li key={`${phase.id}-${deliverable}`} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-2 shrink-0 bg-amber-500" />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
};

type PartnerCardProps = {
  icon?: string;
  title: string;
  valueProposition: string;
  idealFor?: string;
  highlights?: string[];
  ctaLabel?: string;
};

export const PartnerCard: React.FC<PartnerCardProps> = ({
  icon,
  title,
  valueProposition,
  idealFor,
  highlights = [],
  ctaLabel
}) => (
  <article className="panel panel--interactive h-full p-5" data-spotlight>
    <header className="flex items-start gap-3">
      {icon ? (
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center border border-surface-line bg-background-deep/70 text-2xl leading-none"
        >
          <span className="icon-emoji">{icon}</span>
        </span>
      ) : null}
      <div>
        <h3 className="hud-title text-lg leading-tight">{title}</h3>
        {idealFor ? <p className="mt-1 text-sm text-sand-400">{idealFor}</p> : null}
      </div>
    </header>
    <p className="mt-4 text-neutral-200">{valueProposition}</p>
    {highlights.length > 0 ? (
      <ul className="mt-4 space-y-2 text-sm text-neutral-200" role="list">
        {highlights.map((highlight) => (
          <li key={`${title}-${highlight}`} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-[0.45rem] h-1 w-2 shrink-0 bg-amber-500" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    ) : null}
    {ctaLabel ? <p className="mt-4 hud-code">{ctaLabel}</p> : null}
  </article>
);

export const Footer: React.FC<{ year: number; labels: NavItem[]; locale?: Locale; basePath?: string }> = ({
  year,
  labels,
  locale = 'pl',
  basePath
}) => {
  const groups = labels.every((l) => l.group)
    ? buildNavGroups(locale, labels as SiteNavItem[])
    : [{ id: 'start' as const, label: '', items: labels as SiteNavItem[] }];

  return (
    <footer role="contentinfo" className="mt-28 border-t border-surface-border pt-10 pb-12 text-neutral-300">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <div>
          <p className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-neutral-50">Daremon Engineering</p>
          <p className="mt-1 hud-label">adamski.tech</p>
          <div className="measure mt-5 max-w-[14rem] opacity-70" aria-hidden="true" />
        </div>
        <nav aria-label="Stopka" className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.id}>
              {group.label && <p className="hud-label mb-3">{group.label}</p>}
              <ul className="space-y-2" role="list">
                {group.items.map((l) => (
                  <li key={l.id}>
                    <SectionLink
                      sectionId={l.id}
                      basePath={basePath}
                      className="text-sm text-neutral-300 hover:text-amber-300 focus-visible:text-amber-300 transition-colors"
                    >
                      {l.label}
                    </SectionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-10 flex flex-col gap-2 border-t border-surface-border/60 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <small>© {year} Dariusz Adamski — Adamski.tech</small>
        <small className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
          Zaprojektowano w duchu industrial futurism
        </small>
      </div>
    </footer>
  );
};

const SectionIndexMenu: React.FC<{
  items: NavItem[];
  activeId: string | null;
  locale: Locale;
  basePath?: string;
}> = ({ items, activeId, locale, basePath }) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const t = ui[locale].nav;

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-2 border border-surface-border bg-background-deep/60 px-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-neutral-200 hover:border-primary-400 hover:text-neutral-50"
      >
        <IconIndex size={14} />
        {t.index}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full mt-3 w-72 border border-surface-border bg-background-elevated/95 p-2 shadow-card backdrop-blur"
      >
        <p className="hud-label px-3 pb-2 pt-2">{t.indexTitle}</p>
        <ul role="list">
          {items.map((item) => (
            <li key={item.id}>
              <SectionLink
                sectionId={item.id}
                basePath={basePath}
                onClick={() => setOpen(false)}
                aria-current={activeId === item.id ? 'true' : undefined}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  activeId === item.id ? 'bg-amber-500/10 text-amber-300' : 'text-neutral-200 hover:bg-surface-card hover:text-neutral-50'
                }`}
              >
                <span className="font-mono text-[0.7rem] text-neutral-500 tabular-nums">{item.index ?? '--'}</span>
                <span>{item.label}</span>
              </SectionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Navbar: React.FC<{
  labels: NavItem[];
  activeId: string | null;
  locale: Locale;
  onLocaleChange: (loc: Locale) => void;
  basePath?: string;
}> = ({ labels, activeId, locale, onLocaleChange, basePath }) => {
  const t = ui[locale].nav;
  const contactLabel = useMemo(() => {
    const navContact = labels.find((item) => item.id === 'contact');
    if (navContact) return navContact.label;
    if (locale === 'pl') return 'Skontaktuj się';
    if (locale === 'nl') return 'Neem contact op';
    return 'Get in touch';
  }, [labels, locale]);

  const groups = useMemo(
    () => (labels.every((l) => l.group) ? buildNavGroups(locale, labels as SiteNavItem[]) : []),
    [labels, locale]
  );
  const primaryGroups = groups.filter((g) => g.id !== 'start' && g.id !== 'contact');

  return (
    <header role="banner" className="nav-shell sticky top-0 z-50">
      <nav aria-label={t.mainLabel} className="max-w-screen-xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <SectionLink sectionId="hero" basePath={basePath} aria-label={t.home} className="group flex items-center gap-3 shrink-0">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
            <path d="M2 2h20l8 8v20H10l-8-8z" fill="#252c24" stroke="#8e9a67" strokeWidth="1.2" />
            <path d="M9 9h7.5a6.5 6.5 0 0 1 0 13H9z" fill="none" stroke="#d9a441" strokeWidth="2" />
            <path d="M13 13v5" stroke="#e4e7dc" strokeWidth="2" />
          </svg>
          <span className="leading-none">
            <span className="block font-heading text-[0.95rem] font-semibold uppercase tracking-[0.1em] text-neutral-50 group-hover:text-amber-300 transition-colors">
              Daremon<span className="hidden sm:inline"> Engineering</span>
            </span>
            <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.28em] text-neutral-500">adamski.tech</span>
          </span>
        </SectionLink>

        {primaryGroups.length > 0 ? (
          <ul className="hidden lg:flex items-center gap-7" role="list">
            {primaryGroups.map((group) => {
              const target = group.items[0];
              const isActive = group.items.some((i) => i.id === activeId);
              return (
                <li key={group.id}>
                  <SectionLink
                    sectionId={target.id}
                    basePath={basePath}
                    className="nav-link"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {group.label}
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="hidden lg:flex items-center gap-6" role="list">
            {labels.map((l) => (
              <li key={l.id}>
                <SectionLink
                  sectionId={l.id}
                  basePath={basePath}
                  className="nav-link"
                  aria-current={activeId === l.id ? 'true' : undefined}
                >
                  {l.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <SectionIndexMenu items={labels} activeId={activeId} locale={locale} basePath={basePath} />
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
          <MobileMenu labels={labels} activeId={activeId} locale={locale} basePath={basePath} ctaLabel={contactLabel} />
          <SectionLink
            sectionId="contact"
            basePath={basePath}
            className="hidden lg:inline-flex btn btn--primary btn--sm"
            aria-label={contactLabel}
          >
            {contactLabel}
          </SectionLink>
        </div>
      </nav>
    </header>
  );
};

export { RadarChart } from './components/RadarChart';
export type { RadarChartProps, RadarChartAxis } from './components/RadarChart';
export { AudioPlayer } from './components/AudioPlayer';
export type { AudioPlayerProps } from './components/AudioPlayer';
export { MobileMenu } from './components/MobileMenu';
