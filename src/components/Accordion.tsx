import React, { useEffect, useId, useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /** Ustawia id na wrapperze div — hash navigation scrolluje do widocznego nagłówka */
  sectionId?: string;
  /** Ref dla IntersectionObservera w App.tsx — obserwuje zawsze widoczny wrapper */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Numer sekcji w systemie HUD, np. "04" */
  index?: string;
  /** Krótki opis zawartości widoczny także w stanie zwiniętym */
  summary?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  sectionId,
  containerRef,
  index,
  summary
}) => {
  const [isOpen, setIsOpen] = useState(
    () => defaultOpen || (sectionId ? window.location.hash === `#${sectionId}` : false)
  );

  useEffect(() => {
    if (!sectionId) return;
    const handler = () => {
      if (window.location.hash === `#${sectionId}`) setIsOpen(true);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [sectionId]);

  const panelId = useId();
  const triggerId = useId();

  return (
    <div
      ref={containerRef as React.Ref<HTMLDivElement>}
      id={sectionId}
      className={`section panel panel--lg ${isOpen ? 'panel--accent' : ''} ${className}`}
      data-spotlight
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7 md:py-6 focus-visible:ring-inset focus-visible:ring-offset-0"
      >
        <span className="flex min-w-0 items-center gap-4">
          {index && (
            <span aria-hidden="true" className="section-rail__index shrink-0">
              {index}
            </span>
          )}
          <span className="min-w-0">
            <span className="block font-heading text-xl font-semibold uppercase tracking-[0.04em] text-neutral-50 md:text-2xl">
              {title}
            </span>
            {summary && <span className="mt-1 block hud-label normal-case tracking-[0.14em]">{summary}</span>}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`grid h-10 w-10 shrink-0 place-items-center border transition-[transform,border-color,color] duration-300 ${
            isOpen
              ? 'rotate-180 border-amber-500 text-amber-400'
              : 'rotate-0 border-surface-line text-primary-300 group-hover:border-primary-400'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        </span>
      </button>

      {/* aria-hidden ukrywa treść przed AT gdy zwinięty; grid-rows animuje wysokość */}
      <div
        id={panelId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-surface-border/70 px-4 pb-6 pt-6 md:px-7">{children}</div>
        </div>
      </div>
    </div>
  );
};
