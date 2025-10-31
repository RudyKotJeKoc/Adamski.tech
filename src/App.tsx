import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import contentAll from '../content/content.json';
import {
  Navbar,
  Footer,
  SectionHeading,
  ProjectCard,
  SkillTag,
  Reveal,
  LanguageSwitcher,
  Locale,
  AboutCard,
  MetricCounter,
  WorkflowDiagram,
  TimelineSlider,
  PartnerCard,
  RadarChart
} from './components';

type SectionId = 'hero' | 'about' | 'ai' | 'equipment' | 'skills' | 'career' | 'projects' | 'brand' | 'partners' | 'contact';

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
type ProjectItem = ProjectsContent['items'][number];

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

  const labels = useMemo(
    () => [
      { id: 'hero', label: content[locale].navigation.hero },
      { id: 'about', label: content[locale].navigation.about },
      { id: 'ai', label: content[locale].navigation.ai },
      { id: 'equipment', label: content[locale].navigation.equipment },
      { id: 'skills', label: content[locale].navigation.skills },
      { id: 'career', label: content[locale].navigation.career },
      { id: 'projects', label: content[locale].navigation.projects },
      { id: 'brand', label: content[locale].navigation.brand },
      { id: 'partners', label: content[locale].navigation.partners },
      { id: 'contact', label: content[locale].navigation.contact }
    ],
    [locale]
  );

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
    ai: useRef<HTMLElement | null>(null),
    equipment: useRef<HTMLElement | null>(null),
    skills: useRef<HTMLElement | null>(null),
    career: useRef<HTMLElement | null>(null),
    projects: useRef<HTMLElement | null>(null),
    brand: useRef<HTMLElement | null>(null),
    partners: useRef<HTMLElement | null>(null),
    contact: useRef<HTMLElement | null>(null)
  };

  const [activeId, setActiveId] = useState<string | null>('hero');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  useEffect(() => {
    setSelectedSkill('all');
  }, [locale]);

  useEffect(() => {
    const options: IntersectionObserverInit = { threshold: 0.5 };
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

  const projectsContent = content[locale].projects as ProjectsContent;
  const projectItems = (projectsContent?.items ?? []) as ProjectItem[];

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

  const skillCollator = useMemo(() => new Intl.Collator(locale), [locale]);

  const projectSkills = useMemo(() => {
    const unique = new Set<string>();
    projectItems.forEach((project) => {
      (project.skills ?? []).forEach((skill) => {
        if (skill) unique.add(skill);
      });
    });
    return Array.from(unique).sort(skillCollator.compare);
  }, [projectItems, skillCollator]);

  const filteredProjects = useMemo(() => {
    if (selectedSkill === 'all') return projectItems;
    return projectItems.filter((project) => project.skills?.includes(selectedSkill));
  }, [projectItems, selectedSkill]);

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
    const stars = Array.from({ length: totalStars }, (_, idx) => (idx < filled ? '★' : '☆')).join('');
    return (
      <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
        <span aria-hidden="true" className="text-accent-led text-base leading-none tracking-tight">
          {stars}
        </span>
        <span className="sr-only">{ratingSrText(rating)}</span>
        <span aria-hidden="true" className="text-neutral-300 text-sm">
          {formatRatingValue(rating.value)}/{formatRatingValue(rating.scale)}
        </span>
      </span>
    );
  };

  const highlightsTitle =
    locale === 'pl' ? 'Najważniejsze wyróżniki' : locale === 'nl' ? 'Belangrijkste highlights' : 'Key highlights';

  const chartValueLabel = locale === 'pl' ? 'Ocena' : locale === 'nl' ? 'Score' : 'Score';

  // Smooth scroll offset handled via scroll-margin in CSS (.section)
  const contactContent = content[locale].contact;
  const envContactEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();
  const contactEmail = envContactEmail && envContactEmail.length > 0 ? envContactEmail : contactContent.email ?? 'contact@adamski.tech';
  const linkedinUrl = contactContent.socials?.linkedin ?? '#';
  const callUrl = contactContent.call_url ?? linkedinUrl;
  const contactChannels = contactContent.channels ?? [];
  const privacyLink = contactContent.privacy;
  const year = new Date().getFullYear();

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <a className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:px-3 focus:py-2 focus:rounded-button focus:bg-surface.card focus:text-neutral-50" href="#main">
        Pomiń nawigację
      </a>

      <Navbar labels={labels} activeId={activeId} locale={locale} onLocaleChange={setLocale} />

      <main id="main" className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Hero */}
        <section
          id="hero"
          ref={sectionsRef.hero as React.RefObject<HTMLElement>}
          aria-labelledby="hero-title"
          className="section hero relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[75vh] flex items-center bg-hero-bg rounded-card px-4 md:px-8 mt-8 overflow-hidden"
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
          <div className="relative z-10 w-full grid md:grid-cols-2 gap-8 items-center">
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
                <h1 id="hero-title" className="text-3xl md:text-5xl font-heading font-semibold text-neutral-50">
                  {heroContent.heading}
                </h1>
                {heroContent.tagline && <p className="hero-tagline">{heroContent.tagline}</p>}
                <p className="text-neutral-300 md:text-lg">{heroContent.subheading}</p>
                <div className="hero-cta-group" role="group" aria-label={heroCtaGroupLabel}>
                  <a
                    href="#contact"
                    className="hero-cta hero-cta--primary"
                    aria-label={heroContent.cta_primary_aria ?? heroContent.cta_primary}
                  >
                    {heroContent.cta_primary}
                  </a>
                  <a
                    href="#projects"
                    className="hero-cta hero-cta--secondary"
                    aria-label={heroContent.cta_secondary_aria ?? heroContent.cta_secondary}
                  >
                    {heroContent.cta_secondary}
                  </a>
                  <a
                    href="/dariusz-adamski-cv.pdf"
                    className="hero-cta hero-cta--ghost"
                    aria-label={heroContent.cta_tertiary_aria ?? heroContent.cta_tertiary}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {heroContent.cta_tertiary}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal className="hidden md:block">
              <div className="hero-visual" aria-hidden="true">
                <div className="hero-visual__glow" />
                <div className="hero-visual__frame">
                  <p className="hero-visual__title">{heroContent.badge_label}</p>
                  {heroSequence.length > 0 && (
                    <ul className="hero-visual__list">
                      {heroSequence.map((word) => (
                        <li key={`hero-visual-${word}`}>{word}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          ref={sectionsRef.about as React.RefObject<HTMLElement>}
          aria-labelledby="about-title"
          className="section mt-24"
        >
          <SectionHeading id="about-title" title={content[locale].about.title} />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {content[locale].about.cards?.map((card) => (
              <Reveal key={card.title}>
                <AboutCard title={card.title} icon={card.icon} items={card.items} cta={card.cta} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* AI Methodology */}
        <section
          id="ai"
          ref={sectionsRef.ai as React.RefObject<HTMLElement>}
          aria-labelledby="ai-title"
          className="section mt-24"
        >
          <SectionHeading
            id="ai-title"
            title={content[locale].ai_methodology.title}
            subtitle={content[locale].ai_methodology.subtitle}
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {content[locale].ai_methodology.metrics.map((metric) => (
                <Reveal key={metric.id}>
                  <MetricCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    label={metric.label}
                    description={metric.description}
                    locale={locale}
                  />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/90 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].ai_methodology.workflow.title}</h3>
                <p className="mt-3 text-neutral-300">{content[locale].ai_methodology.subtitle}</p>
                <div className="mt-6">
                  <WorkflowDiagram phases={content[locale].ai_methodology.workflow.phases} />
                </div>
                {content[locale].ai_methodology.workflow.automation.length > 0 && (
                  <div className="mt-6 rounded-card border border-dashed border-surface-border bg-background-elevated/60 p-4">
                    <h4 className="text-sm uppercase tracking-wide text-primary-300">
                      {locale === 'pl'
                        ? 'Warstwa automatyzacji'
                        : locale === 'en'
                        ? 'Automation layer'
                        : 'Automatiseringslaag'}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-200" role="list">
                      {content[locale].ai_methodology.workflow.automation.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </Reveal>
          </div>
        </section>

        {/* Equipment Inventory */}
        <section
          id="equipment"
          ref={sectionsRef.equipment as React.RefObject<HTMLElement>}
          aria-labelledby="equipment-title"
          className="section mt-24"
        >
          <SectionHeading
            id="equipment-title"
            title={content[locale].equipment_inventory.title}
            subtitle={content[locale].equipment_inventory.subtitle}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {content[locale].equipment_inventory.categories.map((category) => (
              <Reveal key={category.name}>
                <article className="rounded-card border border-surface-border bg-surface.card/80 p-5 shadow-card">
                  <header className="mb-4 flex items-start justify-between gap-2">
                    <h3 className="text-xl font-heading text-neutral-50">{category.name}</h3>
                    <span className="text-sm text-neutral-400">{category.items.length} {locale === 'pl' ? 'pozycji' : locale === 'en' ? 'assets' : 'items'}</span>
                  </header>
                  <ul className="grid gap-4" role="list">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-card border border-surface-border/70 bg-background-elevated/60 p-4 transition hover:border-primary-500"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <span
                              aria-hidden="true"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/50 text-xl"
                            >
                              {item.icon}
                            </span>
                          )}
                          <div>
                            <h4 className="font-heading text-neutral-50">{item.name}</h4>
                            <p className="text-xs uppercase tracking-wide text-primary-300">{item.status}</p>
                          </div>
                        </div>
                        {item.specs?.length > 0 && (
                          <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                            {item.specs.map((spec) => (
                              <li key={spec} className="flex items-start gap-2">
                                <span aria-hidden="true" className="mt-1 h-1 w-1 rounded-full bg-accent-led" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section
          id="skills"
          ref={sectionsRef.skills as React.RefObject<HTMLElement>}
          aria-labelledby="skills-title"
          className="section mt-24"
        >
          <SectionHeading id="skills-title" title={content[locale].skills.title} />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-start">
            <Reveal className="lg:row-span-2">
              <article className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
                <div
                  role="tablist"
                  aria-label={locale === 'pl' ? 'Kategorie kompetencji' : locale === 'nl' ? 'Competentiecategorieën' : 'Competency categories'}
                  className="flex flex-wrap gap-3"
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
                        className={`flex-1 min-w-[12rem] px-4 py-3 rounded-button border text-left transition focus-visible:outline-none ${
                          isActive
                            ? 'bg-primary-600 text-white border-primary-500 shadow-lg'
                            : 'bg-transparent text-neutral-200 border-surface-border hover:bg-surface.card'
                        }`}
                      >
                        <span className="block font-heading font-semibold text-base">{cat.name}</span>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                          {renderRating(cat.rating)}
                          {cat.rating.label && (
                            <span className="inline-flex items-center rounded-full bg-primary-600/20 px-2 py-0.5 text-xs text-primary-200">
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
                        <ul className="space-y-3" role="list">
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
                                  className={`w-full rounded-md border px-4 py-3 text-left transition focus-visible:outline-none ${
                                    isCompActive
                                      ? 'border-primary-500 bg-primary-500/10 shadow-md'
                                      : 'border-surface-border bg-surface.card/30 hover:bg-surface.card'
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
                          className="rounded-md border border-surface-border bg-surface.card/60 p-4 shadow-inner"
                          role="status"
                          aria-live="polite"
                        >
                          <h4 className="font-heading text-lg font-semibold text-neutral-50">
                            {activeCompetency?.name}
                          </h4>
                          {activeCompetency?.detail && (
                            <p className="mt-2 text-sm text-neutral-200 md:text-base">{activeCompetency.detail}</p>
                          )}
                          {activeCompetency?.experience && (
                            <p className="mt-3 text-sm text-neutral-300">{activeCompetency.experience}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
                <RadarChart
                  title={skillsContent.chart.title}
                  axes={skillsContent.chart.axes}
                  maxValue={skillsContent.chart.max}
                  valueLabel={chartValueLabel}
                />
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-card bg-surface.card border border-surface-border p-4 shadow-card">
                <h3 className="font-heading text-lg font-semibold text-neutral-50">{highlightsTitle}</h3>
                <ul className="mt-3 space-y-2" role="list">
                  {skillsContent.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-neutral-200">
                      <span aria-hidden="true" className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-led" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Career Timeline */}
        <section
          id="career"
          ref={sectionsRef.career as React.RefObject<HTMLElement>}
          aria-labelledby="career-title"
          className="section mt-24"
        >
          <SectionHeading
            id="career-title"
            title={content[locale].career_timeline.title}
            subtitle={content[locale].career_timeline.subtitle}
          />
          <Reveal>
            <TimelineSlider
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

        {/* Projects */}
        <section
          id="projects"
          ref={sectionsRef.projects as React.RefObject<HTMLElement>}
          aria-labelledby="projects-title"
          className="section mt-24"
        >
          <SectionHeading id="projects-title" title={content[locale].projects.title} />
          <div className="mb-6 flex flex-col gap-3">
            <span className="text-sm text-neutral-300" id="projects-filter-label">
              {projectFilterLabel}
            </span>
            <div
              role="group"
              aria-labelledby="projects-filter-label"
              className="flex flex-wrap gap-2"
            >
              <button
                type="button"
                className={`px-3 py-1 rounded-chip border border-surface-border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
                  selectedSkill === 'all'
                    ? 'bg-primary-600 text-white border-primary-500'
                    : 'bg-transparent text-neutral-200 hover:bg-surface.card'
                }`}
                aria-pressed={selectedSkill === 'all'}
                onClick={() => setSelectedSkill('all')}
              >
                {allProjectsLabel}
              </button>
              {projectSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`px-3 py-1 rounded-chip border border-surface-border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
                    selectedSkill === skill
                      ? 'bg-primary-600 text-white border-primary-500'
                      : 'bg-transparent text-neutral-200 hover:bg-surface.card'
                  }`}
                  aria-pressed={selectedSkill === skill}
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((pr) => (
              <Reveal key={pr.name}>
                <ProjectCard
                  locale={locale}
                  name={pr.name}
                  tagline={pr.tagline}
                  summary={pr.summary}
                  challenge={pr.challenge}
                  approach={pr.approach}
                  outcome={pr.outcome}
                  metrics={pr.metrics}
                  skills={pr.skills}
                  image={pr.image}
                  ctas={pr.ctas}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-6">
            <a href="#contact" className="text-primary-500 hover:text-primary-300">
              {locale === 'pl' ? 'Chcesz podobne wdrożenie? Skontaktuj się' : locale === 'en' ? 'Want a similar implementation? Get in touch' : 'Wil je iets soortgelijks? Neem contact op'}
            </a>
          </div>
        </section>

        {/* Daremon Brand */}
        <section
          id="brand"
          ref={sectionsRef.brand as React.RefObject<HTMLElement>}
          aria-labelledby="brand-title"
          className="section mt-24"
        >
          <SectionHeading id="brand-title" title={content[locale].brand.title} />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].brand.philosophy.title}</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {content[locale].brand.philosophy.items.map((item) => (
                    <div key={item.id} className="rounded-card border border-surface-border/60 bg-background-elevated/60 p-4">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/60 text-xl">
                            {item.icon}
                          </span>
                        )}
                        <h4 className="font-heading text-neutral-50">{item.name}</h4>
                      </div>
                      <p className="mt-2 text-sm text-neutral-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal>
              <article className="rounded-card border border-surface-border bg-surface.card/80 p-6 shadow-card">
                <h3 className="text-xl font-heading text-neutral-50">{content[locale].brand.services.title}</h3>
                <div className="mt-5 space-y-4">
                  {content[locale].brand.services.items.map((service) => (
                    <article
                      key={service.id}
                      className="rounded-card border border-surface-border/70 bg-background-elevated/60 p-5 transition hover:border-primary-500"
                    >
                      <h4 className="text-lg font-heading text-neutral-50">{service.name}</h4>
                      <p className="mt-2 text-neutral-200">{service.description}</p>
                      {service.deliverables?.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-2">
                              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {service.cta && <p className="mt-4 text-sm font-medium text-primary-300">{service.cta}</p>}
                    </article>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Partners */}
        <section
          id="partners"
          ref={sectionsRef.partners as React.RefObject<HTMLElement>}
          aria-labelledby="partners-title"
          className="section mt-24"
        >
          <SectionHeading
            id="partners-title"
            title={content[locale].partners.title}
            subtitle={content[locale].partners.subtitle}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content[locale].partners.cards.map((card) => (
              <Reveal key={card.id}>
                <PartnerCard
                  icon={card.icon}
                  title={card.title}
                  valueProposition={card.value_proposition}
                  idealFor={card.ideal_for}
                  highlights={card.highlights}
                  ctaLabel={card.cta_label}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          ref={sectionsRef.contact as React.RefObject<HTMLElement>}
          aria-labelledby="contact-title"
          className="section mt-24"
        >
          <SectionHeading id="contact-title" title={contactContent.title} subtitle={contactContent.subtitle} />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-card bg-surface.card border border-surface-border p-6 shadow-card flex flex-col gap-6">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-neutral-50">{contactContent.headline ?? contactContent.title}</h3>
                <p className="mt-3 text-neutral-300 text-base">{contactContent.subtext ?? contactContent.subtitle}</p>
              </div>
              <ul role="list" className="space-y-4">
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
                    <li key={`${channel.type ?? channel.label}-${channel.value}`} className="rounded-card bg-background-elevated/60 border border-surface-border px-4 py-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <span className="font-semibold text-neutral-100">{channel.label}</span>
                        {channelHref ? (
                          <a
                            href={channelHref}
                            className="text-primary-400 hover:text-primary-200 break-all"
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
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${contactEmail}`}
                  className="px-4 py-2 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led text-center"
                  aria-label={`${contactContent.ctas?.email ?? 'Email'}: ${contactEmail}`}
                >
                  {contactContent.ctas?.email ?? contactContent.email_label}
                </a>
                <a
                  href={linkedinUrl}
                  className="px-4 py-2 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white text-center"
                  aria-label={`${contactContent.ctas?.linkedin ?? 'LinkedIn'}: ${linkedinUrl}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contactContent.ctas?.linkedin ?? 'LinkedIn'}
                </a>
                <a
                  href={callUrl}
                  className="px-4 py-2 rounded-button border border-surface-border text-neutral-100 hover:border-primary-500 hover:text-primary-100 text-center"
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
              className="rounded-card bg-surface.card border border-surface-border p-6 shadow-card"
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
              <fieldset className="space-y-4" aria-label="Formularz kontaktowy">
                <div>
                  <label htmlFor="name" className="block text-neutral-200 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-button bg-background-elevated border border-surface-border px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-neutral-200 mb-1">
                    {contactContent.email_label}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-button bg-background-elevated border border-surface-border px-3 py-2"
                  />
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <label htmlFor="message" className="block text-neutral-200 mb-1">
                      Wiadomość
                    </label>
                    <span id="message-help" className="text-xs text-neutral-400">
                      Podaj kontekst projektu, zakres i terminy.
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-card bg-background-elevated border border-surface-border px-3 py-2"
                    aria-describedby="message-help"
                  />
                </div>
              </fieldset>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-button text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led"
                  aria-label="Wyślij wiadomość email"
                >
                  Wyślij
                </button>
                <a
                  href={`mailto:${contactEmail}`}
                  className="px-4 py-2 rounded-button border border-primary-600 text-primary-50 !bg-transparent !hover:bg-transparent hover:text-white text-center"
                  aria-label={`Otwórz klienta poczty dla ${contactEmail}`}
                >
                  {contactContent.ctas?.email ?? contactContent.email_label}
                </a>
              </div>
              <small id="contact-note" className="block mt-4 text-sm text-neutral-400">
                Dane wykorzystane wyłącznie do kontaktu.{' '}
                {privacyLink?.url ? (
                  <a href={privacyLink.url} className="text-primary-400 hover:text-primary-200" target="_blank" rel="noreferrer noopener">
                    {privacyLink.label}
                  </a>
                ) : null}
                .
              </small>
            </form>
          </div>
        </section>

        <Footer year={year} labels={labels} />
      </main>
    </LocaleContext.Provider>
  );
};

export default App;