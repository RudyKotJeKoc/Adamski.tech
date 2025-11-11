import React, { useState } from 'react';

export type SkillCategory = {
  id: string;
  name: string;
  icon?: string;
  competencies: Competency[];
};

export type Competency = {
  id: string;
  name: string;
  experience?: string;
  rating?: {
    value: number;
    scale: number;
  };
  detail?: string;
};

interface SkillsOverviewProps {
  title: string;
  categories: SkillCategory[];
}

export const SkillsOverview: React.FC<SkillsOverviewProps> = ({ title, categories }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categories[0]?.id ?? null);

  if (!categories.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-semibold text-neutral-50">{title}</h3>

      <div className="space-y-3">
        {categories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const avgRating = category.competencies.reduce((sum, comp) => {
            if (comp.rating) {
              return sum + (comp.rating.value / comp.rating.scale) * 100;
            }
            return sum;
          }, 0) / category.competencies.filter(c => c.rating).length;

          return (
            <div
              key={category.id}
              className="rounded-card border border-surface-border bg-surface-card/80 overflow-hidden"
            >
              {/* Category header */}
              <button
                type="button"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-card transition text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 flex-1">
                  {category.icon && (
                    <span className="text-2xl" aria-hidden="true">
                      {category.icon}
                    </span>
                  )}
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-neutral-50">{category.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {category.competencies.length} competen{category.competencies.length === 1 ? 'tie' : 'ties'}
                    </p>
                  </div>
                  {!isNaN(avgRating) && (
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-24 h-2 bg-surface-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
                          style={{ width: `${avgRating}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-200 w-10 text-right">
                        {avgRating.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
                <span
                  className="ml-4 text-neutral-400 transition-transform duration-200"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              {/* Competencies list */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-surface-border pt-3">
                  {category.competencies.map((competency) => {
                    const percentage = competency.rating
                      ? (competency.rating.value / competency.rating.scale) * 100
                      : null;

                    return (
                      <div key={competency.id} className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-neutral-200">
                            {competency.name}
                          </span>
                          {competency.experience && (
                            <span className="text-xs text-neutral-400 whitespace-nowrap">
                              {competency.experience}
                            </span>
                          )}
                        </div>

                        {percentage !== null && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-surface-bg rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-neutral-300 w-12 text-right">
                              {competency.rating?.value}/{competency.rating?.scale}
                            </span>
                          </div>
                        )}

                        {competency.detail && (
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {competency.detail}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsOverview;
