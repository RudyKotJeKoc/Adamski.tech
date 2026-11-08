import React, { useEffect, useRef } from 'react';
import type { MediaImage } from '../../lib/portfolio';
import { ui } from '../../lib/strings';
import type { Locale } from '../../components';
import { IconChevronLeft, IconChevronRight, IconClose } from '../ui/Icons';

type LightboxProps = {
  images: MediaImage[];
  index: number | null;
  locale: Locale;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Natywny <dialog>: pułapka fokusu, Esc i przywracanie fokusu zapewnia przeglądarka. */
export const Lightbox: React.FC<LightboxProps> = ({ images, index, locale, onClose, onIndexChange }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const t = ui[locale].lightbox;
  const total = images.length;
  const open = index !== null && total > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const go = (delta: number) => {
    if (index === null || total === 0) return;
    onIndexChange((index + delta + total) % total);
  };

  const current = index !== null ? images[index] : undefined;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={t.dialogLabel}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      {current && (
        <>
          <div className="flex items-center justify-between gap-4 border-b border-surface-border px-4 py-3 md:px-6">
            <p className="hud-label tabular-nums" aria-live="polite">
              {`${String((index ?? 0) + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
            </p>
            <button
              type="button"
              autoFocus
              className="grid h-10 w-10 place-items-center border border-surface-border text-neutral-100 hover:border-amber-500 hover:text-amber-300"
              aria-label={t.close}
              onClick={() => dialogRef.current?.close()}
            >
              <IconClose size={18} />
            </button>
          </div>

          <figure
            className="relative grid min-h-0 place-items-center p-3 md:p-8"
            onPointerDown={(event) => {
              touchStartX.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (touchStartX.current === null) return;
              const dx = event.clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              className="max-h-full max-w-full select-none object-contain tile-enter"
              draggable={false}
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-surface-border bg-background-deep/80 text-neutral-100 hover:border-amber-500 hover:text-amber-300 md:left-6"
                  aria-label={t.previous}
                  onClick={() => go(-1)}
                >
                  <IconChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-surface-border bg-background-deep/80 text-neutral-100 hover:border-amber-500 hover:text-amber-300 md:right-6"
                  aria-label={t.next}
                  onClick={() => go(1)}
                >
                  <IconChevronRight size={22} />
                </button>
              </>
            )}
          </figure>

          <div className="min-h-[3.25rem] border-t border-surface-border px-4 py-3 text-sm text-neutral-200 md:px-6">
            {current.caption ?? current.alt}
          </div>
        </>
      )}
    </dialog>
  );
};
