import React from 'react';
import { SectionHeading, Reveal, PartnerCard } from '../../components';

interface PartnerCardData {
  id: string;
  icon?: string;
  title: string;
  value_proposition: string;
  ideal_for?: string;
  highlights?: string[];
  cta_label?: string;
}

interface PartnersSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  content: {
    title: string;
    subtitle?: string;
    cards: PartnerCardData[];
  };
  showHeading?: boolean;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  sectionRef,
  content,
  showHeading = true,
}) => (
  <section
    id="partners"
    ref={sectionRef as React.Ref<HTMLElement>}
    {...(showHeading ? { 'aria-labelledby': 'partners-title' } : { 'aria-label': content.title })}
    className={showHeading ? 'section mt-24' : 'section'}
  >
    {showHeading && <SectionHeading id="partners-title" title={content.title} subtitle={content.subtitle} />}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {content.cards.map((card) => (
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
);
