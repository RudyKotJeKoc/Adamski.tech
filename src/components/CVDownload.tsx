import React, { useState } from 'react';

type CVLanguage = 'nl' | 'en' | 'pl';

interface CVDownloadProps {
  buttonText: string;
  ariaLabel?: string;
}

const languageLabels: Record<CVLanguage, string> = {
  nl: 'Nederlands',
  en: 'English',
  pl: 'Polski'
};

const languageFlags: Record<CVLanguage, string> = {
  nl: '🇳🇱',
  en: '🇬🇧',
  pl: '🇵🇱'
};

export const CVDownload: React.FC<CVDownloadProps> = ({ buttonText, ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = (lang: CVLanguage) => {
    const link = document.createElement('a');
    link.href = `/cv/dariusz-adamski-cv-${lang}.pdf`;
    link.download = `dariusz-adamski-cv-${lang}.pdf`;
    link.click();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hero-cta hero-cta--ghost w-full sm:w-auto"
        aria-label={ariaLabel ?? buttonText}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {buttonText}
        <span className="ml-2" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-20 w-full sm:w-auto min-w-[200px] border border-surface-border bg-background-elevated shadow-card"
            role="menu"
            aria-orientation="vertical"
          >
            {(Object.keys(languageLabels) as CVLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleDownload(lang)}
                className="w-full px-4 py-3 text-left text-sm text-neutral-200 border-l-2 border-transparent hover:border-amber-500 hover:bg-amber-500/10 hover:text-neutral-50 transition flex items-center gap-3"
                role="menuitem"
              >
                <span className="text-xl" aria-hidden="true">
                  {languageFlags[lang]}
                </span>
                <span className="font-medium">{languageLabels[lang]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CVDownload;
