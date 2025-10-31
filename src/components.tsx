import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  return (
    <div role="group" aria-label="Wybór języka" className="flex items-center gap-2">
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

export const MetricCounter: React.FC<{
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  duration?: number;
  locale: Locale;
}> = ({ value, suffix = '', label, description, duration = 1200, locale }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTriggered(true);
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    if (prefersReducedMotion()) {
      setDisplayValue(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(value * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [triggered, value, duration]);

  const decimals = Number.isInteger(value) ? 0 : 1;
  const formatted = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals && displayValue > 0 && !Number.isInteger(value) ? 1 : 0
    });
    return formatter.format(triggered ? displayValue : 0);
  }, [displayValue, decimals, locale, triggered, value]);

  return (
    <article
      ref={ref}
      className="rounded-card bg-surface.card border border-surface-border p-5 shadow-card transition-transform hover:-translate-y-1 hover:shadow-md"
    >
      <div className="text-3xl font-heading font-semibold text-neutral-50" aria-live="polite">
        {formatted}
        <span className="text-primary-400">{suffix}</span>
      </div>
      <h3 className="mt-3 text-lg font-heading text-neutral-100">{label}</h3>
      {description && <p className="mt-2 text-sm text-neutral-300">{description}</p>}
    </article>
  );
};

export type WorkflowPhase = {
  id: string;
  name: string;
  summary: string;
  deliverables: string[];
  icon?: string;
};

export const WorkflowDiagram: React.FC<{ phases: WorkflowPhase[] }> = ({ phases }) => (
  <ol className="relative grid gap-6" role="list">
    {phases.map((phase, index) => (
      <li key={phase.id} className="relative pl-12">
        <div
          className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-accent-led text-lg"
          aria-hidden="true"
        >
          {phase.icon ?? '•'}
        </div>
        {index < phases.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute left-5 top-10 h-full w-px bg-surface-border"
          />
        )}
        <article className="rounded-card border border-surface-border bg-background-elevated/70 p-4 backdrop-blur">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-heading text-neutral-50">{phase.name}</h3>
            <span className="text-xs uppercase tracking-wide text-primary-300">{index + 1}/{phases.length}</span>
          </header>
          <p className="mt-2 text-neutral-300">{phase.summary}</p>
          {phase.deliverables.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
              {phase.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </li>
    ))}
  </ol>
);

export type TimelineMilestone = {
  id: string;
  period: string;
  role: string;
  context?: string;
  summary: string;
  highlights?: string[];
};

export const TimelineSlider: React.FC<{
  milestones: TimelineMilestone[];
  label: string;
}> = ({ milestones, label }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = (index: number) => {
    const normalized = (index + milestones.length) % milestones.length;
    setActiveIndex(normalized);
  };

  useEffect(() => {
    const node = tabsRef.current[activeIndex];
    if (!node) return;
    if (prefersReducedMotion()) {
      node.scrollIntoView({ block: 'nearest', inline: 'center' });
      return;
    }
    node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const active = milestones[activeIndex];

  return (
    <div className="space-y-4" role="region" aria-label={label}>
      <article
        id={`timeline-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`timeline-tab-${active.id}`}
        className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card"
      >
        <header className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary-300">{active.period}</p>
            <h3 className="text-2xl font-heading text-neutral-50">{active.role}</h3>
          </div>
          {active.context && <span className="text-neutral-300">{active.context}</span>}
        </header>
        <p className="mt-3 text-neutral-200" aria-live="polite">
          {active.summary}
        </p>
        {active.highlights && active.highlights.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-neutral-200" role="list">
            {active.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-led" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
      <div className="flex flex-col gap-3 rounded-card border border-surface-border bg-background-elevated/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="rounded-button border border-surface-border px-3 py-2 text-sm text-neutral-200 transition hover:border-primary-500 hover:text-primary-200"
            aria-label="Previous milestone"
          >
            ‹
          </button>
          <p className="text-sm text-neutral-300">{activeIndex + 1} / {milestones.length}</p>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="rounded-button border border-surface-border px-3 py-2 text-sm text-neutral-200 transition hover:border-primary-500 hover:text-primary-200"
            aria-label="Next milestone"
          >
            ›
          </button>
        </div>
        <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto pb-1">
          {milestones.map((milestone, index) => (
            <button
              key={milestone.id}
              id={`timeline-tab-${milestone.id}`}
              role="tab"
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              aria-controls={activeIndex === index ? `timeline-panel-${milestone.id}` : undefined}
              aria-selected={activeIndex === index}
              onClick={() => goTo(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  goTo(index + 1);
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  goTo(index - 1);
                }
              }}
              className={`min-w-[6rem] rounded-card border px-3 py-2 text-left text-sm transition ${
                activeIndex === index
                  ? 'border-primary-500 bg-primary-600/20 text-primary-200'
                  : 'border-transparent bg-surface.card text-neutral-300 hover:text-neutral-50'
              }`}
            >
              <span className="block text-xs uppercase tracking-wide text-neutral-400">{milestone.period}</span>
              <span className="block font-medium text-neutral-100">{milestone.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PartnerCard: React.FC<{
  icon?: string;
  title: string;
  valueProposition: string;
  idealFor?: string;
  highlights?: string[];
  ctaLabel?: string;
}> = ({ icon, title, valueProposition, idealFor, highlights = [], ctaLabel }) => (
  <article className="group relative flex h-full flex-col rounded-card border border-surface-border bg-surface.card p-5 shadow-card transition-transform hover:-translate-y-1 hover:shadow-lg">
    {icon && (
      <span aria-hidden="true" className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-700/60 text-2xl">
        {icon}
      </span>
    )}
    <h3 className="text-xl font-heading text-neutral-50">{title}</h3>
    <p className="mt-2 text-neutral-200">{valueProposition}</p>
    {idealFor && <p className="mt-2 text-sm text-neutral-300">{idealFor}</p>}
    {highlights.length > 0 && (
      <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-led" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
    {ctaLabel && (
      <p className="mt-4 text-sm font-medium text-primary-300">{ctaLabel}</p>
    )}
  </article>
);

type ProjectLinks = { demo?: string; repo?: string };
export const ProjectCard: React.FC<{
  name: string;
  tagline?: string;
  description?: string;
  tech?: string[];
  links?: ProjectLinks;
}> = ({ name, tagline, description, tech = [], links }) => (
  <article className="rounded-card bg-surface.card border border-surface-border shadow-card transition-shadow hover:shadow-md hover-glow p-4">
    <figure className="aspect-video rounded-card overflow-hidden bg-black/30 mb-3">
      {/* Placeholder image */}
      <img
        src="/assets/placeholder.jpg"
        alt={`Miniatura projektu: ${name}`}
        className="w-full h-full object-cover opacity-90"
        loading="lazy"
      />
    </figure>
    <h3 className="text-xl font-heading font-semibold text-neutral-50">{name}</h3>
    {tagline && <p className="text-neutral-300 mt-1">{tagline}</p>}
    {description && <p className="text-neutral-200 mt-2">{description}</p>}
    {tech.length > 0 && (
      <ul className="flex flex-wrap gap-2 mt-3" role="list">
        {tech.map((t) => (
          <li key={t}>
            <SkillTag label={t} />
          </li>
        ))}
      </ul>
    )}
    <div className="flex gap-3 mt-4">
      {links?.repo && (
        <a
          className="px-3 py-2 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white focus-visible:outline-none"
          href={links.repo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Szczegóły
        </a>
      )}
      {links?.demo && (
        <a
          className="px-3 py-2 rounded-button border border-accent-blue_tech text-accent-blue_tech !bg-transparent !hover:bg-transparent hover:text-white focus-visible:outline-none"
          href={links.demo}
          target="_blank"
          rel="noopener noreferrer"
        >
          Demo
        </a>
      )}
    </div>
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
          >
            Skontaktuj się
          </a>
        </div>
      </nav>
    </header>
  );
};