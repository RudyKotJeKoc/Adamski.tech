import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildNavGroups, type NavItem as SiteNavItem } from '../lib/navigation';
import { ui } from '../lib/strings';
import { SectionLink } from './ui/SectionLink';
import type { Locale } from '../components';

type NavItem = { id: string; label: string; group?: SiteNavItem['group']; index?: string };

interface MobileMenuProps {
  labels: NavItem[];
  activeId: string | null;
  locale?: Locale;
  basePath?: string;
  ctaLabel?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ labels, activeId, locale = 'pl', basePath, ctaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const t = ui[locale].nav;

  const groups = labels.every((l) => l.group)
    ? buildNavGroups(locale, labels as SiteNavItem[])
    : [{ id: 'start' as const, label: '', items: labels as SiteNavItem[] }];

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on ESC key, focus management
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden relative z-[60] grid h-9 w-9 place-items-center border border-surface-border bg-background-deep/70 text-neutral-50 hover:border-amber-500"
        aria-label={isOpen ? t.close : t.open}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path strokeLinecap="square" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="square" strokeWidth={1.8} d="M4 7h16M4 12h10M4 17h16" />
          )}
        </svg>
      </button>

      {/* Portal: nagłówek ma backdrop-filter, który tworzy kontener dla position:fixed */}
      {createPortal(
        <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background-deep/75 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        id="mobile-menu"
        ref={panelRef}
        inert={!isOpen}
        className={`fixed top-0 right-0 bottom-0 z-40 w-full max-w-sm border-l border-surface-border bg-background-elevated shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={t.mobileLabel}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-6 pt-20">
          <div className="measure mb-6 opacity-70" aria-hidden="true" />
          <div className="flex-1 space-y-6">
            {groups.map((group) => (
              <div key={group.id}>
                {group.label && <p className="hud-label mb-2 px-1">{group.label}</p>}
                <ul className="space-y-1" role="list">
                  {group.items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <SectionLink
                          sectionId={item.id}
                          basePath={basePath}
                          onClick={handleLinkClick}
                          aria-current={isActive ? 'true' : undefined}
                          className={`flex items-center gap-3 border-l-2 px-3 py-3 text-base transition-colors ${
                            isActive
                              ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                              : 'border-transparent text-neutral-200 hover:border-primary-400 hover:bg-surface-card hover:text-neutral-50'
                          }`}
                        >
                          {item.index && (
                            <span className="font-mono text-[0.7rem] text-neutral-500 tabular-nums">{item.index}</span>
                          )}
                          <span>{item.label}</span>
                        </SectionLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact CTA in mobile menu */}
          <div className="pt-6 mt-6 border-t border-surface-border">
            <SectionLink sectionId="contact" basePath={basePath} onClick={handleLinkClick} className="btn btn--primary btn--block">
              {ctaLabel ?? 'Skontaktuj się'}
            </SectionLink>
          </div>
        </div>
      </nav>
        </>,
        document.body
      )}
    </>
  );
};
