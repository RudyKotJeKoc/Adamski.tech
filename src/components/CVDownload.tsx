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
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hero-cta hero-cta--ghost"
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
            className="absolute right-0 top-full mt-2 z-20 min-w-[200px] rounded-card border border-surface-border bg-surface-card shadow-card"
            role="menu"
            aria-orientation="vertical"
          >
            {(Object.keys(languageLabels) as CVLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleDownload(lang)}
                className="w-full px-4 py-3 text-left text-sm text-neutral-200 hover:bg-primary-600/20 hover:text-primary-50 transition flex items-center gap-3 first:rounded-t-card last:rounded-b-card"
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
