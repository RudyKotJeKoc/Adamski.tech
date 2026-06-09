import React from 'react';
import { SectionHeading, Reveal, MetricCounter, WorkflowDiagram, type Locale } from '../../components';

interface AIMetric {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  description?: string;
}

interface WorkflowPhase {
  id: string;
  name: string;
  summary: string;
  deliverables?: string[];
  icon?: string;
}

interface AIMethodologySectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  content: {
    title: string;
    subtitle: string;
    metrics: AIMetric[];
    workflow: {
      title: string;
      phases: WorkflowPhase[];
      automation: string[];
    };
  };
  locale: Locale;
}

const automationLabel: Record<Locale, string> = {
  pl: 'Warstwa automatyzacji',
  en: 'Automation layer',
  nl: 'Automatiseringslaag',
};

export const AIMethodologySection: React.FC<AIMethodologySectionProps> = ({ sectionRef, content, locale }) => (
  <section
    id="ai"
    ref={sectionRef as React.Ref<HTMLElement>}
    aria-labelledby="ai-title"
    className="section mt-24"
  >
    <SectionHeading id="ai-title" title={content.title} subtitle={content.subtitle} />
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
      <div className="grid gap-4 sm:grid-cols-2">
        {content.metrics.map((metric) => (
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
        <article className="rounded-card border border-surface-border bg-surface-card/90 p-6 shadow-card">
          <h3 className="text-xl font-heading text-neutral-50">{content.workflow.title}</h3>
          <p className="mt-3 text-neutral-300">{content.subtitle}</p>
          <div className="mt-6">
            <WorkflowDiagram phases={content.workflow.phases} />
          </div>
          {content.workflow.automation.length > 0 && (
            <div className="mt-6 rounded-card border border-dashed border-surface-border bg-background-elevated/60 p-4">
              <h4 className="text-sm uppercase tracking-wide text-primary-300">
                {automationLabel[locale]}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-200" role="list">
                {content.workflow.automation.map((item) => (
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
);
