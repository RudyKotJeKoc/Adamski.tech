import React, { useEffect, useRef, useState } from 'react';

export type Locale = 'pl' | 'en' | 'nl';

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

export { RadarChart } from './components/RadarChart';
export type { RadarChartProps, RadarChartAxis } from './components/RadarChart';