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
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  sectionId,
  containerRef,
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
      className={`section rounded-card border border-surface-border bg-surface-card/30 ${className}`}
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/60 rounded-card"
      >
        <span className="text-xl font-heading font-semibold text-neutral-50">{title}</span>
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border text-primary-300 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* aria-hidden ukrywa treść przed AT gdy zwinięty; grid-rows animuje wysokość */}
      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-2 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
