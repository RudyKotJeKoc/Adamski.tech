import React, { useEffect, useState } from 'react';

type NavItem = { id: string; label: string };

interface MobileMenuProps {
  labels: NavItem[];
  activeId: string | null;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ labels, activeId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-50 p-2 rounded-button border border-surface-border text-neutral-50 hover:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isOpen ? (
            // X icon when open
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Hamburger icon when closed
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 z-40 w-72 bg-surface-card border-l border-surface-border shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Nawigacja mobilna"
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Navigation Links */}
          <ul role="menu" className="space-y-2 flex-1">
            {labels.map((item) => (
              <li key={item.id} role="none">
                <a
                  role="menuitem"
                  href={`#${item.id}`}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-button text-base transition-colors ${
                    activeId === item.id
                      ? 'bg-primary-600 text-white font-semibold'
                      : 'text-neutral-200 hover:bg-surface-border hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact CTA in mobile menu */}
          <div className="pt-4 border-t border-surface-border">
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="block w-full px-4 py-3 rounded-button text-center text-white bg-gradient-to-r from-primary-600 to-accent-led hover:from-primary-700 hover:to-accent-led font-medium"
            >
              Skontaktuj się
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};
