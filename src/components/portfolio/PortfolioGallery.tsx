import React, { useId, useMemo, useState } from 'react';
import type { PortfolioProject } from '../../lib/portfolio';
import { ui } from '../../lib/strings';
import type { Locale } from '../../components';
import { ProjectTile } from './ProjectTile';

type PortfolioGalleryProps = {
  projects: PortfolioProject[];
  locale: Locale;
  skillFilterLabel: string;
  allLabel: string;
  showDraftBanner?: boolean;
};

const readInitialCategory = () => {
  try {
    return new URLSearchParams(window.location.search).get('kategoria') ?? 'all';
  } catch {
    return 'all';
  }
};

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  projects,
  locale,
  skillFilterLabel,
  allLabel,
  showDraftBanner = false
}) => {
  const t = ui[locale].portfolio;
  const ids = useId();
  const [category, setCategory] = useState<string>(readInitialCategory);
  const [skill, setSkill] = useState<string>('all');

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; code: string; label: string; count: number }>();
    projects.forEach((p) => {
      const entry = map.get(p.category.id) ?? { ...p.category, count: 0 };
      entry.count += 1;
      map.set(p.category.id, entry);
    });
    return Array.from(map.values());
  }, [projects]);

  const activeCategory = categories.some((c) => c.id === category) ? category : 'all';

  const skills = useMemo(() => {
    const collator = new Intl.Collator(locale);
    const unique = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((tech) => unique.add(tech)));
    return Array.from(unique).sort(collator.compare);
  }, [projects, locale]);

  const activeSkill = skill === 'all' || skills.includes(skill) ? skill : 'all';

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (activeCategory === 'all' || p.category.id === activeCategory) &&
          (activeSkill === 'all' || p.technologies.includes(activeSkill))
      ),
    [projects, activeCategory, activeSkill]
  );

  const ordinals = useMemo(() => {
    const counters = new Map<string, number>();
    const result = new Map<string, number>();
    projects.forEach((p) => {
      const n = (counters.get(p.category.id) ?? 0) + 1;
      counters.set(p.category.id, n);
      result.set(p.slug, n);
    });
    return result;
  }, [projects]);

  // Szeroka karta tylko dla projektu oznaczonego w CMS jako wyróżniony (pierwszy na liście).
  const hasWideTile = activeCategory === 'all' && activeSkill === 'all' && filtered.length >= 3 && filtered[0].featured;
  const filterKey = `${activeCategory}|${activeSkill}`;

  return (
    <div>
      {showDraftBanner && (
        <p className="mb-5 flex items-center gap-3 border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <span className="led led--blink" aria-hidden="true" />
          {t.draftsBanner}
        </p>
      )}

      <div className="panel panel--flat panel--ghost mb-6 flex flex-col gap-5 p-4 md:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p id={`${ids}-cat`} className="hud-label mb-2.5">
            {t.categoryFilterLabel}
          </p>
          <div
            role="group"
            aria-labelledby={`${ids}-cat`}
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
          >
            <button type="button" className="chip shrink-0" aria-pressed={activeCategory === 'all'} onClick={() => setCategory('all')}>
              {t.allCategories}
              <span className="chip__count">{String(projects.length).padStart(2, '0')}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip shrink-0"
                aria-pressed={activeCategory === c.id}
                onClick={() => setCategory(c.id)}
              >
                <span aria-hidden="true" className="text-neutral-500">
                  {c.code}
                </span>
                {c.label}
                <span className="chip__count">{String(c.count).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="w-full shrink-0 lg:w-72">
            <label htmlFor={`${ids}-skill`} className="field-label">
              {skillFilterLabel}
            </label>
            <select id={`${ids}-skill`} className="field" value={activeSkill} onChange={(e) => setSkill(e.target.value)}>
              <option value="all">{allLabel}</option>
              {skills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="mb-4 hud-label" aria-live="polite">
        {t.results(filtered.length)}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectTile
              key={`${filterKey}-${project.slug}`}
              project={project}
              locale={locale}
              ordinal={ordinals.get(project.slug) ?? i + 1}
              wide={hasWideTile && i === 0}
              delay={Math.min(i, 8) * 60}
            />
          ))}
        </div>
      ) : (
        <div className="panel panel--inset grid place-items-center gap-4 px-6 py-14 text-center">
          <p className="text-neutral-300">{t.empty}</p>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              setCategory('all');
              setSkill('all');
            }}
          >
            {t.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
