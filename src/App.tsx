import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import contentAll from '../content/content.json';
import {
  Navbar,
  Footer,
  SectionHeading,
  Reveal,
  Locale,
  AudioPlayer
} from './components';
import { InteractiveTimeline } from './components/InteractiveTimeline';
import { SkillsOverview } from './components/SkillsOverview';
import { CVDownload } from './components/CVDownload';
import { Accordion } from './components/Accordion';
import { AboutSection } from './components/sections/AboutSection';
import { AIMethodologySection } from './components/sections/AIMethodologySection';
import { EquipmentSection } from './components/sections/EquipmentSection';
import { PartnersSection } from './components/sections/PartnersSection';
import { MediaSection } from './components/sections/MediaSection';
import { HeroSchematic, HeroModules } from './components/hero/HeroSchematic';
import { PortfolioGallery } from './components/portfolio/PortfolioGallery';
import { SiteBackdrop } from './components/ui/SiteBackdrop';
import { IconArrowRight } from './components/ui/Icons';
import { buildNavItems, sectionIndex } from './lib/navigation';
import { draftsVisible, getProjects } from './lib/portfolio';
import { useSpotlight } from './lib/useSpotlight';
import { ui } from './lib/strings';

type SectionId = 'hero' | 'about' | 'career' | 'skills' | 'projects' | 'ai' | 'equipment' | 'brand' | 'media' | 'partners' | 'contact';

type ContentLang = typeof contentAll['pl'];
type ContentMap = { pl: ContentLang; en: ContentLang; nl: ContentLang };

const LocaleContext = createContext<{ locale: Locale; setLocale: (loc: Locale) => void }>({ locale: 'pl', setLocale: () => {} });

type Rating = { value: number; scale: number; label?: string };
type Competency = { id: string; name: string; experience?: string; rating: Rating; detail: string };
type SkillCategory = { id: string; name: string; description: string; rating: Rating; competencies: Competency[] };
type SkillsChartAxis = { id: string; label: string; value: number; description?: string };
type SkillsContent = {
  title: string;
  chart: { title: string; max: number; axes: SkillsChartAxis[] };
  categories: SkillCategory[];
  highlights: string[];
};
type ProjectsContent = ContentLang['projects'];

const App: React.FC = () => {
  const content = contentAll as ContentMap;

  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    const browser = (navigator.language || 'pl').slice(0, 2);
    const initial = stored ?? (['pl', 'en', 'nl'].includes(browser) ? (browser as Locale) : 'pl');
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    const metaTitle = content[locale].meta?.title || 'Adamski.tech';
    const metaDesc =
      content[locale].meta?.description ||
      'Profesjonalna wizytówka inżyniera automatyki i utrzymania ruchu.';
    document.title = metaTitle;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', metaDesc);
  }, [locale]);

  useSpotlight();

  const labels = useMemo(() => buildNavItems(locale), [locale]);

  const heroContent = content[locale].hero;

  const heroSequence = useMemo(() => {
    if (!heroContent) return [] as string[];
    if (Array.isArray((heroContent as { tagline_sequence?: unknown }).tagline_sequence)) {
      return (heroContent as { tagline_sequence: string[] }).tagline_sequence;
    }
    if (typeof heroContent.tagline === 'string') {
      return heroContent.tagline
        .split('→')
        .map((segment) => segment.trim())
        .filter(Boolean);
    }
    return [] as string[];
  }, [heroContent]);

  const heroCtaGroupLabel = useMemo(() => {
    switch (locale) {
      case 'pl':
        return 'Kluczowe działania startowe';
      case 'nl':
        return 'Belangrijkste startacties';
      default:
        return 'Primary hero actions';
    }
  }, [locale]);

  const sectionsRef = {
    hero: useRef<HTMLElement | null>(null),
    about: useRef<HTMLElement | null>(null),
    career: useRef<HTMLElement | null>(null),
    skills: useRef<HTMLElement | null>(null),
    projects: useRef<HTMLElement | null>(null),
    ai: useRef<HTMLElement | null>(null),
    equipment: useRef<HTMLElement | null>(null),
    brand: useRef<HTMLElement | null>(null),
    media: useRef<HTMLElement | null>(null),
    partners: useRef<HTMLElement | null>(null),
    contact: useRef<HTMLElement | null>(null)
  };

  const [activeId, setActiveId] = useState<string | null>('hero');

  useEffect(() => {
    // Aktywna jest sekcja przecinająca środek ekranu — działa także dla sekcji wyższych niż viewport.
    const options: IntersectionObserverInit = { rootMargin: '-45% 0px -50% 0px', threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const id = (e.target as HTMLElement).id as SectionId;
        if (e.isIntersecting) setActiveId(id);
      });
    }, options);
    Object.values(sectionsRef).forEach((ref) => {
      if (ref.current) obs.observe(ref.current);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Wejście z podstrony (np. /#projects): sekcje istnieją dopiero po pierwszym renderze.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  const projectsContent = content[locale].projects as ProjectsContent;

  const projectFilterLabel = useMemo(() => {
    if (projectsContent?.filter_label) return projectsContent.filter_label;
    switch (locale) {
      case 'pl':
        return 'Filtruj projekty według kompetencji';
      case 'nl':
        return 'Filter projecten op competentie';
      default:
        return 'Filter projects by capability';
    }
  }, [locale, projectsContent]);

  const allProjectsLabel = useMemo(() => {
    if (projectsContent?.all_label) return projectsContent.all_label;
    switch (locale) {
      case 'pl':
        return 'Wszystkie projekty';
      case 'nl':
        return 'Alle projecten';
      default:
        return 'All projects';
    }
  }, [locale, projectsContent]);

  const showDrafts = useMemo(() => draftsVisible(), []);
  const portfolioProjects = useMemo(() => getProjects(locale, showDrafts), [locale, showDrafts]);
  const publishedProjects = useMemo(() => getProjects(locale), [locale]);

  const skillsContent = content[locale].skills as SkillsContent;
  const skillCategories = skillsContent.categories;
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() => skillCategories[0]?.id ?? '');
  const [activeCompetencyId, setActiveCompetencyId] = useState<string>(
    () => skillCategories[0]?.competencies[0]?.id ?? ''
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const firstCategory = skillCategories[0];
    setActiveCategoryId(firstCategory?.id ?? '');
    setActiveCompetencyId(firstCategory?.competencies[0]?.id ?? '');
  }, [locale, skillCategories]);

  useEffect(() => {
    const category = skillCategories.find((cat) => cat.id === activeCategoryId);
    if (!category) return;
    if (!category.competencies.some((comp) => comp.id === activeCompetencyId)) {
      setActiveCompetencyId(category.competencies[0]?.id ?? '');
    }
  }, [activeCategoryId, skillCategories, activeCompetencyId]);

  const activeCategory =
    skillCategories.find((cat) => cat.id === activeCategoryId) ?? skillCategories[0];
  const activeCompetency =
    activeCategory?.competencies.find((comp) => comp.id === activeCompetencyId) ??
    activeCategory?.competencies[0];

  const handleTabKey = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!skillCategories.length) return;
      const lastIndex = skillCategories.length - 1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = index === lastIndex ? 0 : index + 1;
        const nextCategory = skillCategories[nextIndex];
        setActiveCategoryId(nextCategory.id);
        setActiveCompetencyId(nextCategory.competencies[0]?.id ?? '');
        tabRefs.current[nextIndex]?.focus();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = index === 0 ? lastIndex : index - 1;
        const prevCategory = skillCategories[prevIndex];
        setActiveCategoryId(prevCategory.id);
        setActiveCompetencyId(prevCategory.competencies[0]?.id ?? '');
        tabRefs.current[prevIndex]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        const firstCategory = skillCategories[0];
        setActiveCategoryId(firstCategory?.id ?? '');
        setActiveCompetencyId(firstCategory?.competencies[0]?.id ?? '');
        tabRefs.current[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        const lastCategory = skillCategories[lastIndex];
        setActiveCategoryId(lastCategory?.id ?? '');
        setActiveCompetencyId(lastCategory?.competencies[0]?.id ?? '');
        tabRefs.current[lastIndex]?.focus();
      }
    },
    [skillCategories]
  );

  const formatRatingValue = (value: number) => (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1));

  const ratingSrText = (rating: Rating) => {
    const base = `${formatRatingValue(rating.value)} / ${formatRatingValue(rating.scale)}`;
    if (locale === 'pl') return `Ocena ${base}`;
    if (locale === 'nl') return `Score ${base}`;
    return `Rating ${base}`;
  };

  const renderRating = (rating: Rating, className?: string) => {
    const totalStars = 5;
    const max = rating.scale || 1;
    const normalized = Math.max(0, Math.min(rating.value / max, 1));
    const filled = Math.round(normalized * totalStars);
    return (
      <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
        <span aria-hidden="true" className="inline-flex gap-[3px]">
          {Array.from({ length: totalStars }, (_, idx) => (
            <span key={idx} className={`h-2 w-3.5 ${idx < filled ? 'bg-amber-500' : 'bg-surface-line'}`} />
          ))}
        </span>
        <span className="sr-only">{ratingSrText(rating)}</span>
        <span aria-hidden="true" className="font-mono text-xs text-neutral-300 tabular-nums">
          {formatRatingValue(rating.value)}/{formatRatingValue(rating.scale)}
        </span>
      </span>
    );
  };

  const highlightsTitle =
    locale === 'pl' ? 'Najważniejsze wyróżniki' : locale === 'nl' ? 'Belangrijkste highlights' : 'Key highlights';

  // Smooth scroll offset handled via scroll-margin in CSS (.section)
  const contactContent = content[locale].contact;
  const envContactEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();
  const contactEmail = envContactEmail && envContactEmail.length > 0 ? envContactEmail : contactContent.email ?? 'contact@adamski.tech';
  const linkedinUrl = contactContent.socials?.linkedin ?? '#';
  const callUrl = contactContent.call_url ?? linkedinUrl;
  const contactChannels = contactContent.channels ?? [];
  const privacyLink = contactContent.privacy;
  const year = new Date().getFullYear();

  const t = ui[locale];
  const equipmentCategories = content[locale].equipment_inventory.categories;
  const equipmentCount = equipmentCategories.reduce((sum, c) => sum + c.items.length, 0);
  const publishedCategoryCount = new Set(publishedProjects.map((p) => p.category.id)).size;
  const heroStatus = [
    { label: t.hero.status.projects, value: String(publishedProjects.length).padStart(2, '0') },
    { label: t.hero.status.categories, value: String(publishedCategoryCount).padStart(2, '0') },
    { label: t.hero.status.equipment, value: String(equipmentCount).padStart(2, '0') },
    { label: t.hero.status.languages, value: 'PL·EN·NL' }
  ];

  const aboutCards = (content[locale].about as { cards?: { title: string }[] }).cards ?? [];

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <SiteBackdrop />
      <a className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:px-3 focus:py-2 focus:rounded-button focus:bg-surface-card focus:text-neutral-50" href="#main">
        Pomiń nawigację
      </a>

      <Navbar labels={labels} activeId={activeId} locale={locale} onLocaleChange={setLocale} />

      <main id="main" className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Hero */}
        <section
          id="hero"
          ref={sectionsRef.hero as React.RefObject<HTMLElement>}
          aria-labelledby="hero-title"
          className="section hero relative mt-6 md:mt-8"
        >
          <div className="hero-background" aria-hidden="true">
            {heroSequence.length > 0 && (
              <>
                <div className="hero-background-layer hero-background-layer--top">
                  <div className="hero-background-track">
                    {Array.from({ length: 3 }).map((_, trackIndex) => (
                      <div className="hero-background-sequence" key={`hero-top-${trackIndex}`}>
                        {heroSequence.map((word, wordIndex) => (
                          <React.Fragment key={`hero-top-${trackIndex}-${word}-${wordIndex}`}>
                            <span className="hero-background-word">{word}</span>
                            {wordIndex < heroSequence.length - 1 && (
                              <span className="hero-background-arrow" aria-hidden="true">
                                →
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hero-background-layer hero-background-layer--bottom">
                  <div className="hero-background-track hero-background-track--alt">
                    {Array.from({ length: 3 }).map((_, trackIndex) => (
                      <div className="hero-background-sequence" key={`hero-bottom-${trackIndex}`}>
                        {heroSequence
                          .slice()
                          .reverse()
                          .map((word, wordIndex) => (
                            <React.Fragment key={`hero-bottom-${trackIndex}-${word}-${wordIndex}`}>
                              <span className="hero-background-word">{word}</span>
                              {wordIndex < heroSequence.length - 1 && (
                                <span className="hero-background-arrow" aria-hidden="true">
                                  →
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-scanlines" aria-hidden="true" />
          <div className="hero-frame" aria-hidden="true">
            <span className="hero-frame__mark left-10 top-2">REF // DAREMON-ENG</span>
            <span className="hero-frame__mark bottom-2 right-10 hidden md:block">GRID 48 · SCALE 1:1</span>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-10 px-5 pb-10 pt-14 sm:px-8 md:px-10 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-4 lg:pb-12">
            <Reveal>
              <div className="space-y-6">
                {heroContent.badge_label && (
                  <div className="hero-badge" role="presentation">
                    <span className="hero-badge__pulse" aria-hidden="true" />
                    <span className="hero-badge__label">{heroContent.badge_label}</span>
                    {heroContent.badge_caption && (
                      <span className="hero-badge__caption">{heroContent.badge_caption}</span>
                    )}
                  </div>
                )}
                <h1 id="hero-title" className="hero-title">
                  {heroContent.heading}
                </h1>
                {heroContent.tagline && <p className="hero-tagline">{heroContent.tagline}</p>}
                <p className="max-w-2xl text-neutral-200 md:text-lg leading-relaxed">{heroContent.subheading}</p>
                <div className="hero-cta-group" role="group" aria-label={heroCtaGroupLabel}>
                  <a
                    href="#contact"
                    className="hero-cta hero-cta--primary"
                    aria-label={heroContent.cta_primary_aria ?? heroContent.cta_primary}
                  >
                    {heroContent.cta_primary}
                    <IconArrowRight size={14} className="btn__arrow" />
                  </a>
                  <a
                    href="#projects"
                    className="hero-cta hero-cta--secondary"
                    aria-label={heroContent.cta_secondary_aria ?? heroContent.cta_secondary}
                  >
                    {heroContent.cta_secondary}
                  </a>
                  <CVDownload
                    buttonText={heroContent.cta_tertiary}
                    ariaLabel={heroContent.cta_tertiary_aria ?? heroContent.cta_tertiary}
                  />
                </div>
              </div>
            </Reveal>
            {heroSequence.length > 0 && (
              <>
                <Reveal className="hidden md:block">
                  <div className="hero-visual">
                    <HeroSchematic layers={heroSequence} title={t.hero.schematicTitle} subtitle={heroContent.badge_label} />
                  </div>
                </Reveal>
                <div className="md:hidden">
                  <HeroModules layers={heroSequence} />
                </div>
              </>
            )}
          </div>

          <dl className="hero-status">
            {heroStatus.map((item) => (
              <div key={item.label} className="hero-status__item">
                <dt className="hud-label">{item.label}</dt>
                <dd className="hero-status__value mt-1">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Portfolio */}
        <section
          id="projects"
          ref={sectionsRef.projects as React.RefObject<HTMLElement>}
          aria-labelledby="projects-title"
          className="section mt-28"
        >
          <SectionHeading id="projects-title" title={content[locale].projects.title} index={sectionIndex('projects')} code="SEC/PORTFOLIO" />

          {/* Audio Player - przykład dla sekcji Projects */}
          {(content[locale].projects as any).audio && (
            <Reveal>
              <AudioPlayer
                src={(content[locale].projects as any).audio}
                title={
                  locale === 'pl'
                    ? 'Przegląd projektów'
                    : locale === 'nl'
                    ? 'Projectenoverzicht'
                    : 'Projects overview'
                }
                type="audio"
                className="mb-6"
              />
            </Reveal>
          )}

          <PortfolioGallery
            projects={portfolioProjects}
            locale={locale}
            skillFilterLabel={projectFilterLabel}
            allLabel={allProjectsLabel}
            showDraftBanner={showDrafts && portfolioProjects.some((p) => p.status === 'draft')}
          />
          <div className="mt-8">
            <a href="#contact" className="link-tech inline-flex items-center gap-2">
              {locale === 'pl' ? 'Chcesz podobne wdrożenie? Skontaktuj się' : locale === 'en' ? 'Want a similar implementation? Get in touch' : 'Wil je iets soortgelijks? Neem contact op'}
              <IconArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Skills */}
        <section
          id="skills"
          ref={sectionsRef.skills as React.RefObject<HTMLElement>}
          aria-labelledby="skills-title"
          className="section mt-28"
        >
          <SectionHeading id="skills-title" title={content[locale].skills.title} index={sectionIndex('skills')} code="SEC/CAPABILITIES" />

          {/* Audio Player - przykład dla sekcji Skills */}
          {(content[locale].skills as any).audio && (
            <Reveal>
              <AudioPlayer
                src={(content[locale].skills as any).audio}
                title={
                  locale === 'pl'
                    ? 'Przegląd umiejętności'
                    : locale === 'nl'
                    ? 'Overzicht vaardigheden'
                    : 'Skills overview'
                }
                type="audio"
                className="mb-6"
              />
            </Reveal>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-start">
            <Reveal className="lg:row-span-2">
              <article className="panel panel--lg hud-corners p-4 md:p-6" data-spotlight>
                <div
                  role="tablist"
                  aria-label={locale === 'pl' ? 'Kategorie kompetencji' : locale === 'nl' ? 'Competentiecategorieën' : 'Competency categories'}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {skillCategories.map((cat, index) => {
                    const isActive = cat.id === activeCategoryId;
                    return (
                      <button
                        key={cat.id}
                        ref={(node) => {
                          tabRefs.current[index] = node;
                        }}
                        type="button"
                        role="tab"
                        id={`skills-tab-${cat.id}`}
                        aria-selected={isActive}
                        aria-controls={`skills-panel-${cat.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActiveCategoryId(cat.id);
                          setActiveCompetencyId(cat.competencies[0]?.id ?? '');
                        }}
                        onKeyDown={(event) => handleTabKey(event, index)}
                        className={`relative px-4 py-3 border text-left transition-colors ${
                          isActive
                            ? 'border-amber-500/80 bg-amber-500/10 text-neutral-50 shadow-[inset_3px_0_0_#d9a441]'
                            : 'border-surface-border bg-background-deep/40 text-neutral-200 hover:border-primary-400 hover:bg-surface-card/60'
                        }`}
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="font-mono text-[0.68rem] text-neutral-500 tabular-nums" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-heading font-semibold text-base uppercase tracking-[0.04em]">{cat.name}</span>
                        </span>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                          {renderRating(cat.rating)}
                          {cat.rating.label && (
                            <span className="inline-flex items-center border border-primary-400/50 bg-primary-600/20 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-primary-200">
                              {cat.rating.label}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {skillCategories.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <div
                      key={cat.id}
                      role="tabpanel"
                      id={`skills-panel-${cat.id}`}
                      aria-labelledby={`skills-tab-${cat.id}`}
                      hidden={!isActive}
                      className="mt-6"
                    >
                      <p className="text-neutral-200 text-sm md:text-base">{cat.description}</p>
                      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                        <ul className="space-y-2" role="list">
                          {cat.competencies.map((comp) => {
                            const isCompActive = comp.id === activeCompetencyId;
                            return (
                              <li key={comp.id}>
                                <button
                                  type="button"
                                  onClick={() => setActiveCompetencyId(comp.id)}
                                  onMouseEnter={() => setActiveCompetencyId(comp.id)}
                                  onFocus={() => setActiveCompetencyId(comp.id)}
                                  aria-pressed={isCompActive}
                                  className={`w-full border-l-2 px-4 py-3 text-left transition-colors ${
                                    isCompActive
                                      ? 'border-amber-500 bg-amber-500/10'
                                      : 'border-surface-line bg-background-deep/40 hover:bg-surface-card/70'
                                  }`}
                                >
                                  <span className="flex flex-wrap items-center justify-between gap-2 font-medium text-neutral-100">
                                    {comp.name}
                                    {renderRating(comp.rating, 'text-xs text-neutral-300')}
                                  </span>
                                  {comp.experience && (
                                    <span className="mt-1 block text-sm text-neutral-300">{comp.experience}</span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div
                          className="panel panel--inset panel--sm p-5 lg:sticky lg:top-24 self-start"
                          role="status"
                          aria-live="polite"
                        >
                          <p className="hud-code" aria-hidden="true">DETAIL // {cat.name}</p>
                          <h4 className="mt-2 font-heading text-lg font-semibold text-neutral-50">
                            {activeCompetency?.name}
                          </h4>
                          {activeCompetency?.detail && (
                            <p className="mt-2 text-sm text-neutral-200 md:text-base">{activeCompetency.detail}</p>
                          )}
                          {activeCompetency?.experience && (
                            <p className="mt-3 text-sm text-sand-400">{activeCompetency.experience}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </article>
            </Reveal>
            <Reveal>
              <article className="panel p-5" data-spotlight>
                <SkillsOverview
                  title={skillsContent.chart.title}
                  categories={skillsContent.categories}
                />
              </article>
            </Reveal>
            <Reveal>
              <article className="panel panel--accent p-5" data-spotlight>
                <h3 className="hud-title text-lg">{highlightsTitle}</h3>
                <ul className="mt-4 space-y-2.5" role="list">
                  {skillsContent.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5 text-neutral-200">
                      <span aria-hidden="true" className="mt-[0.45rem] inline-flex h-1.5 w-1.5 shrink-0 bg-amber-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Daremon Brand */}
        <section
          id="brand"
          ref={sectionsRef.brand as React.RefObject<HTMLElement>}
          aria-labelledby="brand-title"
          className="section mt-28"
        >
          <SectionHeading id="brand-title" title={content[locale].brand.title} index={sectionIndex('brand')} code="SEC/SERVICES" />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
            <Reveal>
              <article className="panel panel--lg h-full p-6" data-spotlight>
                <h3 className="hud-title text-xl">{content[locale].brand.philosophy.title}</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {content[locale].brand.philosophy.items.map((item) => (
                    <div key={item.id} className="panel panel--inset panel--sm p-4">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center border border-surface-line bg-background-deep/70 text-xl">
                            <span className="icon-emoji">{item.icon}</span>
                          </span>
                        )}
                        <h4 className="font-heading font-semibold text-neutral-50">{item.name}</h4>
                      </div>
                      <p className="mt-2 text-sm text-neutral-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal>
              <article className="panel panel--lg hud-corners h-full p-6" data-spotlight>
                <h3 className="hud-title text-xl">{content[locale].brand.services.title}</h3>
                <div className="mt-5 space-y-3">
                  {content[locale].brand.services.items.map((service, serviceIndex) => (
                    <article
                      key={service.id}
                      className="panel panel--inset panel--sm panel--interactive p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-amber-400 tabular-nums" aria-hidden="true">
                          {`PKG-${String(serviceIndex + 1).padStart(2, '0')}`}
                        </span>
                        <h4 className="text-lg font-heading font-semibold text-neutral-50">{service.name}</h4>
                      </div>
                      <p className="mt-2 text-neutral-200">{service.description}</p>
                      {service.deliverables?.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-1.5" role="list">
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="tag">
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      )}
                      {service.cta && <p className="mt-4 hud-code">{service.cta}</p>}
                    </article>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <Accordion
          sectionId="equipment"
          containerRef={sectionsRef.equipment}
          title={content[locale].equipment_inventory.title}
          index={sectionIndex('equipment')}
          summary={content[locale].equipment_inventory.subtitle}
          className="mt-28"
        >
          <EquipmentSection
            content={content[locale].equipment_inventory}
            locale={locale}
            showHeading={false}
          />
        </Accordion>

        <AIMethodologySection
          sectionRef={sectionsRef.ai}
          content={content[locale].ai_methodology}
          locale={locale}
          index={sectionIndex('ai')}
        />

        <MediaSection
          sectionRef={sectionsRef.media}
          content={content[locale].media}
          locale={locale}
          index={sectionIndex('media')}
          channelUrl={contactContent.socials?.youtube}
          projects={publishedProjects}
        />

        <Accordion
          sectionId="about"
          containerRef={sectionsRef.about}
          title={content[locale].about.title}
          index={sectionIndex('about')}
          summary={aboutCards.map((card) => card.title).join(' · ')}
          className="mt-28"
        >
          <AboutSection
            content={content[locale].about as { title: string; audio?: string; cards?: { title: string; icon?: string; items: string[]; cta?: { label: string; href: string } | null }[] }}
            locale={locale}
            showHeading={false}
          />
        </Accordion>

        {/* Career Timeline */}
        <section
          id="career"
          ref={sectionsRef.career as React.RefObject<HTMLElement>}
          aria-labelledby="career-title"
          className="section mt-28"
        >
          <SectionHeading
            id="career-title"
            title={content[locale].career_timeline.title}
            subtitle={content[locale].career_timeline.subtitle}
            index={sectionIndex('career')}
            code="SEC/TIMELINE"
          />
          <Reveal>
            <InteractiveTimeline
              milestones={content[locale].career_timeline.milestones}
              label={
                locale === 'pl'
                  ? `${content[locale].career_timeline.title} — oś czasu`
                  : locale === 'nl'
                  ? `${content[locale].career_timeline.title} — tijdlijn`
                  : `${content[locale].career_timeline.title} timeline`
              }
            />
          </Reveal>
        </section>

        <Accordion
          sectionId="partners"
          containerRef={sectionsRef.partners}
          title={content[locale].partners.title}
          index={sectionIndex('partners')}
          summary={content[locale].partners.subtitle}
          className="mt-28"
        >
          <PartnersSection
            content={content[locale].partners}
            showHeading={false}
          />
        </Accordion>

        {/* Contact */}
        <section
          id="contact"
          ref={sectionsRef.contact as React.RefObject<HTMLElement>}
          aria-labelledby="contact-title"
          className="section mt-28"
        >
          <SectionHeading
            id="contact-title"
            title={contactContent.title}
            subtitle={contactContent.subtitle}
            index={sectionIndex('contact')}
            code="SEC/CONTACT"
          />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="panel panel--lg hud-corners p-6 md:p-7 flex flex-col gap-6" data-spotlight>
              <div>
                <p className="hud-code flex items-center gap-2">
                  <span className="led led--olive led--blink" aria-hidden="true" />
                  CHANNEL OPEN
                </p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-neutral-50">{contactContent.headline ?? contactContent.title}</h3>
                <p className="mt-3 text-neutral-300 text-base">{contactContent.subtext ?? contactContent.subtitle}</p>
              </div>
              <ul role="list" className="space-y-3">
                {contactChannels.map((channel) => {
                  const channelHref =
                    channel.type === 'email'
                      ? `mailto:${contactEmail}`
                      : channel.type === 'linkedin'
                      ? linkedinUrl
                      : channel.type === 'call'
                      ? contactContent.call_url ?? callUrl
                      : undefined;
                  return (
                    <li key={`${channel.type ?? channel.label}-${channel.value}`} className="panel panel--inset panel--sm px-4 py-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-sand-400">{channel.label}</span>
                        {channelHref ? (
                          <a
                            href={channelHref}
                            className="text-amber-400 hover:text-amber-300 break-all"
                            aria-label={`${channel.label}: ${channel.value}`}
                            target={channel.type === 'email' ? undefined : '_blank'}
                            rel={channel.type === 'email' ? undefined : 'noreferrer noopener'}
                          >
                            {channel.value}
                          </a>
                        ) : (
                          <span className="text-neutral-300 break-all">{channel.value}</span>
                        )}
                      </div>
                      {channel.description ? <p className="mt-1 text-sm text-neutral-400">{channel.description}</p> : null}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <a
                  href={`mailto:${contactEmail}`}
                  className="btn btn--primary"
                  aria-label={`${contactContent.ctas?.email ?? 'Email'}: ${contactEmail}`}
                >
                  {contactContent.ctas?.email ?? contactContent.email_label}
                </a>
                <a
                  href={linkedinUrl}
                  className="btn btn--secondary"
                  aria-label={`${contactContent.ctas?.linkedin ?? 'LinkedIn'}: ${linkedinUrl}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contactContent.ctas?.linkedin ?? 'LinkedIn'}
                </a>
                <a
                  href={callUrl}
                  className="btn btn--ghost"
                  aria-label={`${contactContent.ctas?.call ?? 'Book a call'}: ${callUrl}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contactContent.ctas?.call ?? 'Book a call'}
                </a>
              </div>
              <p className="text-sm text-neutral-400">{contactContent.availability_note}</p>
            </div>
            <form
              id="contact-form"
              aria-describedby="contact-note message-help"
              className="panel panel--lg p-6 md:p-7"
              data-spotlight
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const name = String(fd.get('name') || '');
                const email = String(fd.get('email') || '');
                const message = String(fd.get('message') || '');
                const subject = encodeURIComponent(`Kontakt z Adamski.tech — ${name}`);
                const body = encodeURIComponent(`Imię i nazwisko: ${name}\nEmail: ${email}\n\nWiadomość:\n${message}`);
                window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
              }}
            >
              <p className="hud-code mb-5" aria-hidden="true">FORM // MSG-01</p>
              <fieldset className="space-y-4" aria-label="Formularz kontaktowy">
                <div>
                  <label htmlFor="name" className="field-label">
                    Imię i nazwisko
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="field-label">
                    {contactContent.email_label}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="field"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <label htmlFor="message" className="field-label">
                      Wiadomość
                    </label>
                    <span id="message-help" className="text-xs text-neutral-400 mb-1.5">
                      Podaj kontekst projektu, zakres i terminy.
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="field"
                    aria-describedby="message-help"
                  />
                </div>
              </fieldset>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn btn--primary"
                  aria-label="Wyślij wiadomość email"
                >
                  Wyślij
                  <IconArrowRight size={14} className="btn__arrow" />
                </button>
                <a
                  href={`mailto:${contactEmail}`}
                  className="btn btn--secondary"
                  aria-label={`Otwórz klienta poczty dla ${contactEmail}`}
                >
                  {contactContent.ctas?.email ?? contactContent.email_label}
                </a>
              </div>
              <small id="contact-note" className="block mt-4 text-sm text-neutral-400">
                Dane wykorzystane wyłącznie do kontaktu.{' '}
                {privacyLink?.url ? (
                  <a href={privacyLink.url} className="link-tech" target="_blank" rel="noreferrer noopener">
                    {privacyLink.label}
                  </a>
                ) : null}
                .
              </small>
            </form>
          </div>
        </section>

        <Footer year={year} labels={labels} locale={locale} />
      </main>
    </LocaleContext.Provider>
  );
};

export default App;
