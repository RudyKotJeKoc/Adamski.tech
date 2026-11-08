import React from 'react';
import { SectionHeading, Reveal, type Locale } from '../../components';

interface EquipmentItem {
  id: string;
  icon?: string;
  name: string;
  specs: string[];
  status: string;
}

interface EquipmentCategory {
  name: string;
  items: EquipmentItem[];
}

interface EquipmentSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
  content: {
    title: string;
    subtitle?: string;
    categories: EquipmentCategory[];
  };
  locale: Locale;
  showHeading?: boolean;
}

const itemCountLabels: Record<Locale, string> = {
  pl: 'pozycji',
  en: 'assets',
  nl: 'onderdelen',
};

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  sectionRef,
  content,
  locale,
  showHeading = true,
}) => {
  const itemCountLabel = itemCountLabels[locale];

  return (
    <section
      id={showHeading ? 'equipment' : undefined}
      ref={sectionRef as React.Ref<HTMLElement>}
      aria-labelledby={showHeading ? 'equipment-title' : undefined}
      aria-label={showHeading ? undefined : content.title}
      className={showHeading ? 'section mt-24' : undefined}
    >
      {showHeading && <SectionHeading id="equipment-title" title={content.title} subtitle={content.subtitle} />}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {content.categories.map((category, categoryIndex) => (
          <Reveal key={category.name}>
            <article className="panel hud-corners h-full p-5 md:p-6" data-spotlight>
              <header className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="hud-code" aria-hidden="true">{`BAY ${String(categoryIndex + 1).padStart(2, '0')}`}</p>
                  <h3 className="hud-title mt-1 text-xl">{category.name}</h3>
                </div>
                <span className="shrink-0 border border-surface-border px-2 py-1 font-mono text-xs text-neutral-300 tabular-nums">
                  {String(category.items.length).padStart(2, '0')} {itemCountLabel}
                </span>
              </header>
              <ul className="grid gap-3" role="list">
                {category.items.map((item) => (
                  <li key={item.id} className="panel panel--inset panel--sm panel--interactive p-4">
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <span
                          aria-hidden="true"
                          className="grid h-10 w-10 shrink-0 place-items-center border border-surface-line bg-background-deep/70 text-xl"
                        >
                          <span className="icon-emoji">{item.icon}</span>
                        </span>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-heading font-semibold text-neutral-50">{item.name}</h4>
                        <p className="mt-0.5 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary-300">
                          <span className="led led--olive" aria-hidden="true" />
                          {item.status}
                        </p>
                      </div>
                    </div>
                    {item.specs.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm text-neutral-200" role="list">
                        {item.specs.map((spec, specIndex) => (
                          <li key={`${spec}-${specIndex}`} className="flex items-start gap-2">
                            <span aria-hidden="true" className="mt-[0.55rem] h-px w-2.5 shrink-0 bg-amber-500" />
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
  );
};
