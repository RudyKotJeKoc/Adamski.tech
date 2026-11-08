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
  index?: string;
}

const automationLabel: Record<Locale, string> = {
  pl: 'Warstwa automatyzacji',
  en: 'Automation layer',
  nl: 'Automatiseringslaag',
};

export const AIMethodologySection: React.FC<AIMethodologySectionProps> = ({ sectionRef, content, locale, index }) => (
  <section
    id="ai"
    ref={sectionRef as React.Ref<HTMLElement>}
    aria-labelledby="ai-title"
    className="section mt-28"
  >
    <SectionHeading id="ai-title" title={content.title} subtitle={content.subtitle} index={index} code="SEC/AI-WORKFLOW" />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
      <div className="grid gap-4 sm:grid-cols-2 content-start">
        {content.metrics.map((metric) => (
          <Reveal key={metric.id} className="h-full">
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
        <article className="panel panel--lg hud-corners p-6 md:p-7" data-spotlight>
          <h3 className="hud-title text-xl">{content.workflow.title}</h3>
          <p className="mt-3 text-neutral-300">{content.subtitle}</p>
          <div className="mt-6">
            <WorkflowDiagram phases={content.workflow.phases} />
          </div>
          {content.workflow.automation.length > 0 && (
            <div className="mt-6 border border-dashed border-surface-line bg-background-deep/50 p-4">
              <h4 className="hud-code">
                {automationLabel[locale]}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-200" role="list">
                {content.workflow.automation.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-2 shrink-0 bg-primary-400" />
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
