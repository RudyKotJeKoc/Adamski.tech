import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

export type Locale = 'pl' | 'en' | 'nl';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

type NavItem = { id: string; label: string };

export const LanguageSwitcher: React.FC<{ locale: Locale; onChange: (loc: Locale) => void }> = ({ locale, onChange }) => {
  const langs: Locale[] = ['pl', 'en', 'nl'];
  const labels: Record<Locale, string> = {
    pl: 'Wybór języka',
    en: 'Language selection',
    nl: 'Taalkeuze'
  };
  return (
    <div role="group" aria-label={labels[locale]} className="flex items-center gap-2">
      {langs.map((l) => (
        <button
          key={l}
          data-lang={l}
          aria-pressed={locale === l}
          onClick={() => onChange(l)}
          className={`px-3 py-1 rounded-chip border border-surface-border text-sm transition-colors ${
            locale === l ? 'bg-primary-600 text-white' : 'bg-transparent text-neutral-50 hover:bg-surface.card'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export const SectionHeading: React.FC<{ id?: string; title: string; subtitle?: string }> = ({ id, title, subtitle }) => (
  <header className="mb-6">
    <h2 id={id} className="text-2xl md:text-3xl font-heading font-semibold">
      <span className="bg-clip-text text-transparent bg-btn-gradient">{title}</span>
    </h2>
    {subtitle && <p className="text-neutral-300 mt-2">{subtitle}</p>}
  </header>
);

export const SkillTag: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-3 py-1 rounded-chip border border-surface-border text-neutral-200 hover:bg-surface.card focus:bg-surface.card focus-visible:outline-none">
    {label}
  </span>
);


const renderFormatted = (text: string) => {
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
  <article className="h-full rounded-card bg-surface.card border border-surface-border shadow-card transition-shadow hover:shadow-lg focus-within:shadow-lg focus-within:border-accent-led">
    <header className="flex items-start gap-3 p-4 pb-2">
      {icon && (
        <span aria-hidden="true" className="text-2xl leading-none">
          {icon}
        </span>
      )}
      <h3 className="text-xl font-heading font-semibold text-neutral-50">{title}</h3>
    </header>
    <ul className="px-4 pb-4 space-y-2 text-neutral-200" role="list">
      {items.map((item, idx) => (
        <li key={`${title}-${idx}`} className="leading-relaxed">
          {renderFormatted(item)}
        </li>
      ))}
    </ul>
    {cta?.href && cta?.label && (
      <div className="px-4 pb-4">
        <a
          href={cta.href}
          role="button"
          aria-label={`${title}: ${cta.label}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-button border border-primary-600 text-primary-50 hover:text-white hover:border-accent-led focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-led"
        >
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
  ctas = []
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
    primary: 'bg-gradient-to-r from-primary-600 to-accent-led text-white hover:from-primary-700 hover:to-accent-led focus-visible:ring-2 focus-visible:ring-accent-led/70',
    secondary: 'border border-primary-500 text-primary-50 hover:text-white hover:bg-primary-500/10 focus-visible:ring-2 focus-visible:ring-primary-500/70',
    ghost: 'border border-surface-border text-neutral-100 hover:text-white hover:bg-surface.card focus-visible:ring-2 focus-visible:ring-neutral-300/40'
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
    <article className="rounded-card bg-surface.card border border-surface-border shadow-card transition-shadow hover:shadow-lg hover-glow flex flex-col h-full">
      <figure className="aspect-video rounded-t-card overflow-hidden bg-black/20">
        {image?.src ? (
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">
            {locale === 'pl' ? 'Wizualizacja w przygotowaniu' : locale === 'en' ? 'Visual coming soon' : 'Visual volgt binnenkort'}
          </div>
        )}
      </figure>
      <div className="flex flex-col gap-4 p-5 flex-1">
        <header>
          <h3 className="text-xl font-heading font-semibold text-neutral-50">{name}</h3>
          {tagline && <p className="text-neutral-300 mt-1">{tagline}</p>}
          {summary && <p className="text-neutral-200 mt-2">{summary}</p>}
        </header>

        {metrics.length > 0 && (
          <section aria-label={labels.metrics}>
            <ul className="flex flex-wrap gap-2" role="list">
              {metrics.map((metric) => (
                <li key={`${metric.label}-${metric.value}`}>
                  <span className="inline-flex flex-col px-3 py-2 rounded-chip border border-surface-border bg-black/20 text-neutral-100 min-w-[120px]">
                    <span className="text-xs uppercase tracking-wide text-neutral-400">{metric.label}</span>
                    <span className="text-lg font-semibold text-neutral-50">{metric.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-4 text-neutral-200">
          {challenge && (
            <section>
              <h4 className="font-heading text-sm uppercase tracking-wide text-neutral-400">{labels.challenge}</h4>
              <p className="mt-1 leading-relaxed">{challenge}</p>
            </section>
          )}
          {approach.length > 0 && (
            <section>
              <h4 className="font-heading text-sm uppercase tracking-wide text-neutral-400">{labels.approach}</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1" role="list">
                {approach.map((step, index) => (
                  <li key={`${name}-approach-${index}`}>{step}</li>
                ))}
              </ul>
            </section>
          )}
          {outcome && (
            <section>
              <h4 className="font-heading text-sm uppercase tracking-wide text-neutral-400">{labels.outcome}</h4>
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
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-colors focus-visible:outline-none ${variantClass}`}
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
      className="rounded-card border border-surface-border bg-surface.card/80 p-4 shadow-card"
      aria-label={`${label}: ${formattedValue}${suffix}`}
      aria-live="polite"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-heading font-semibold text-primary-200" aria-hidden="true">
          {formattedValue}
        </span>
        {suffix && (
          <span className="text-lg font-medium text-primary-400" aria-hidden="true">
            {suffix.trim()}
          </span>
        )}
      </div>
      <p className="mt-2 text-neutral-100 font-medium">{label}</p>
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
      <ol className="grid gap-4 md:grid-cols-2" role="list">
        {phases.map((phase, index) => (
          <li
            key={phase.id}
            className="rounded-card border border-dashed border-surface-border bg-background-elevated/60 p-4 shadow-inner"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/30 font-heading text-lg text-primary-200"
              >
                {phase.icon ?? index + 1}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">{`Phase ${index + 1}`}</p>
                <h5 className="text-lg font-heading text-neutral-50">{phase.name}</h5>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-200">{phase.summary}</p>
            {phase.deliverables && phase.deliverables.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                {phase.deliverables.map((deliverable) => (
                  <li key={`${phase.id}-${deliverable}`} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-led" />
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

type TimelineMilestone = {
  id: string;
  period: string;
  role: string;
  context?: string;
  summary: string;
  highlights?: string[];
};

export const TimelineSlider: React.FC<{ milestones: TimelineMilestone[]; label: string }> = ({ milestones, label }) => {
  const [activeId, setActiveId] = useState<string>(() => milestones[0]?.id ?? '');
  const sliderId = useId();

  useEffect(() => {
    setActiveId(milestones[0]?.id ?? '');
  }, [milestones]);

  const activeMilestone = useMemo(
    () => milestones.find((milestone) => milestone.id === activeId) ?? milestones[0],
    [activeId, milestones]
  );

  if (!milestones.length || !activeMilestone) {
    return null;
  }

  return (
    <section className="timeline-slider space-y-4">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {milestones.map((milestone, index) => {
          const isActive = milestone.id === activeMilestone.id;
          return (
            <button
              key={milestone.id}
              id={`${sliderId}-tab-${milestone.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${sliderId}-panel-${milestone.id}`}
              onClick={() => setActiveId(milestone.id)}
              className={`rounded-button border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-led ${
                isActive
                  ? 'border-primary-500 bg-primary-600/20 text-primary-50'
                  : 'border-surface-border bg-surface.card/40 text-neutral-200 hover:bg-surface.card'
              }`}
            >
              <span className="block font-semibold text-neutral-50">{milestone.period}</span>
              <span className="block text-xs text-neutral-300">{index + 1}</span>
            </button>
          );
        })}
      </div>
      <article
        role="tabpanel"
        id={`${sliderId}-panel-${activeMilestone.id}`}
        aria-labelledby={`${sliderId}-tab-${activeMilestone.id}`}
        className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card"
      >
        <header className="flex flex-col gap-1">
          <p className="text-sm uppercase tracking-wide text-primary-300">{activeMilestone.period}</p>
          <h3 className="text-xl font-heading font-semibold text-neutral-50">{activeMilestone.role}</h3>
          {activeMilestone.context ? (
            <p className="text-sm text-neutral-300">{activeMilestone.context}</p>
          ) : null}
        </header>
        <p className="mt-4 text-neutral-200">{activeMilestone.summary}</p>
        {activeMilestone.highlights && activeMilestone.highlights.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-neutral-200" role="list">
            {activeMilestone.highlights.map((highlight) => (
              <li key={`${activeMilestone.id}-${highlight}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
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
  <article className="h-full rounded-card border border-surface-border bg-surface.card/80 p-5 shadow-card transition hover:shadow-lg">
    <header className="flex items-start gap-3">
      {icon ? (
        <span aria-hidden="true" className="text-3xl leading-none">
          {icon}
        </span>
      ) : null}
      <div>
        <h3 className="text-lg font-heading font-semibold text-neutral-50">{title}</h3>
        {idealFor ? <p className="text-sm text-neutral-300">{idealFor}</p> : null}
      </div>
    </header>
    <p className="mt-4 text-neutral-200">{valueProposition}</p>
    {highlights.length > 0 ? (
      <ul className="mt-4 space-y-2 text-sm text-neutral-200" role="list">
        {highlights.map((highlight) => (
          <li key={`${title}-${highlight}`} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-led" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    ) : null}
    {ctaLabel ? <p className="mt-4 text-sm font-medium text-primary-300">{ctaLabel}</p> : null}
  </article>
);

export const Footer: React.FC<{ year: number; labels: NavItem[] }> = ({ year, labels }) => (
  <footer role="contentinfo" className="mt-24 border-t border-surface-border py-8 text-neutral-300">
    <nav className="flex flex-wrap gap-4 mb-4">
      {labels.map((l) => (
        <a key={l.id} href={`#${l.id}`} className="hover:text-neutral-50 focus-visible:text-neutral-50">
          {l.label}
        </a>
      ))}
    </nav>
    <div className="text-sm">
      <small>© {year} Dariusz Adamski — Adamski.tech</small>
      <div className="mt-1">
        <small>Zaprojektowano w duchu industrial futurism</small>
      </div>
    </div>
  </footer>
);

export const Navbar: React.FC<{
  labels: NavItem[];
  activeId: string | null;
  locale: Locale;
  onLocaleChange: (loc: Locale) => void;
}> = ({ labels, activeId, locale, onLocaleChange }) => {
  const contactLabel = useMemo(() => {
    const navContact = labels.find((item) => item.id === 'contact');
    if (navContact) return navContact.label;
    if (locale === 'pl') return 'Skontaktuj się';
    if (locale === 'nl') return 'Neem contact op';
    return 'Get in touch';
  }, [labels, locale]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-surface-border"
    >
      <nav aria-label="Główna nawigacja" className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            aria-label="Adamski.tech — strona główna"
            className="font-heading font-semibold text-neutral-50"
          >
            Daremon Engineering
          </a>
        </div>
        <ul id="primary-nav" role="menubar" className="hidden md:flex items-center gap-6">
          {labels.map((l) => (
            <li key={l.id} role="none">
              <a
                role="menuitem"
                href={`#${l.id}`}
                className={`text-neutral-300 hover:text-white ${
                  activeId === l.id ? 'underline decoration-accent-led decoration-2 underline-offset-8' : ''
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
          <a
            href="#contact"
            role="button"
            className="hidden md:inline-block px-4 py-2 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led"
            aria-label={contactLabel}
          >
            {contactLabel}
          </a>
        </div>
      </nav>
    </header>
  );
};

export { RadarChart } from './components/RadarChart';
export type { RadarChartProps, RadarChartAxis } from './components/RadarChart';