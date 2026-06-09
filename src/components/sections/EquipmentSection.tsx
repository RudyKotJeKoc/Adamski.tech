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
  sectionRef: React.RefObject<HTMLElement | null>;
  content: {
    title: string;
    subtitle?: string;
    categories: EquipmentCategory[];
  };
  locale: Locale;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({ sectionRef, content, locale }) => {
  const itemCountLabel = locale === 'pl' ? 'pozycji' : locale === 'en' ? 'assets' : 'items';

  return (
    <section
      id="equipment"
      ref={sectionRef as React.Ref<HTMLElement>}
      aria-labelledby="equipment-title"
      className="section mt-24"
    >
      <SectionHeading id="equipment-title" title={content.title} subtitle={content.subtitle} />
      <div className="grid gap-6 lg:grid-cols-2">
        {content.categories.map((category) => (
          <Reveal key={category.name}>
            <article className="rounded-card border border-surface-border bg-surface-card/80 p-5 shadow-card">
              <header className="mb-4 flex items-start justify-between gap-2">
                <h3 className="text-xl font-heading text-neutral-50">{category.name}</h3>
                <span className="text-sm text-neutral-400">
                  {category.items.length} {itemCountLabel}
                </span>
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
                    {item.specs.length > 0 && (
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
  );
};
