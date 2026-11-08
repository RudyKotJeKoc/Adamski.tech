import { useEffect } from 'react';

/**
 * Jeden delegowany listener dla wszystkich elementów z [data-spotlight]:
 * ustawia --mx/--my, z których panel rysuje poświatę pod kursorem.
 * Wyłączony na ekranach dotykowych i przy prefers-reduced-motion.
 */
export const useSpotlight = () => {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    let frame = 0;
    let current: HTMLElement | null = null;
    let lastEvent: PointerEvent | null = null;

    const reset = (el: HTMLElement | null) => {
      el?.style.removeProperty('--mx');
      el?.style.removeProperty('--my');
    };

    const update = () => {
      frame = 0;
      if (!lastEvent) return;
      const target = (lastEvent.target as Element | null)?.closest<HTMLElement>('[data-spotlight]') ?? null;
      if (target !== current) {
        reset(current);
        current = target;
      }
      if (!current) return;
      const rect = current.getBoundingClientRect();
      current.style.setProperty('--mx', `${lastEvent.clientX - rect.left}px`);
      current.style.setProperty('--my', `${lastEvent.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
      reset(current);
    };
  }, []);
};
