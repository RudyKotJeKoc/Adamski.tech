import React from 'react';
import { SectionHeading, Reveal, AboutCard, AudioPlayer, type Locale } from '../../components';

interface AboutCardData {
  title: string;
  icon?: string;
  items: string[];
  cta?: { label: string; href: string } | null;
}

interface AboutSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
  content: {
    title: string;
    audio?: string;
    cards?: AboutCardData[];
  };
  locale: Locale;
  showHeading?: boolean;
}

const audioTitle: Record<Locale, string> = {
  pl: 'Wprowadzenie',
  en: 'Introduction',
  nl: 'Introductie',
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  sectionRef,
  content,
  locale,
  showHeading = true,
}) => (
  <section
    id={showHeading ? 'about' : undefined}
    ref={sectionRef as React.Ref<HTMLElement>}
    aria-labelledby={showHeading ? 'about-title' : undefined}
    aria-label={showHeading ? undefined : content.title}
    className={showHeading ? 'section mt-24' : undefined}
  >
    {showHeading && <SectionHeading id="about-title" title={content.title} />}
    {content.audio && (
      <Reveal>
        <AudioPlayer
          src={content.audio}
          title={audioTitle[locale]}
          type="audio"
          className="mb-6"
        />
      </Reveal>
    )}
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {content.cards?.map((card, index) => (
        <Reveal key={`${card.title}-${index}`}>
          <AboutCard title={card.title} icon={card.icon} items={card.items} cta={card.cta} />
        </Reveal>
      ))}
    </div>
  </section>
);
