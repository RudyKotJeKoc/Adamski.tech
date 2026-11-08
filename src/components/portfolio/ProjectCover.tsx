import React from 'react';
import type { PortfolioProject } from '../../lib/portfolio';
import type { Locale } from '../../components';
import { ui } from '../../lib/strings';

type ProjectCoverProps = {
  project: PortfolioProject;
  locale: Locale;
  eager?: boolean;
  sizes?: string;
};

export const ProjectCover: React.FC<ProjectCoverProps> = ({ project, locale, eager = false, sizes }) => {
  if (project.cover?.placeholder) {
    // Grafika poglądowa (nie zdjęcie konstrukcji) — pokazana jako ekran na tle rysunku technicznego.
    return (
      <div className="blueprint">
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="placeholder-screen media-placeholder-grade"
        />
      </div>
    );
  }

  if (project.cover) {
    return (
      <img
        src={project.cover.src}
        alt={project.cover.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
      />
    );
  }

  return (
    <div className="blueprint" role="img" aria-label={`${project.title} — ${ui[locale].portfolio.noPhoto}`}>
      <svg viewBox="0 0 240 150" className="w-3/5 max-w-[16rem]" aria-hidden="true">
        <rect x="20" y="20" width="200" height="110" fill="none" stroke="rgba(142,154,103,0.55)" strokeDasharray="4 4" />
        <path d="M20 20l200 110M220 20L20 130" stroke="rgba(142,154,103,0.25)" />
        <circle cx="120" cy="75" r="22" fill="#141815" stroke="#d9a441" strokeWidth="1.2" />
        <text
          x="120"
          y="79"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="11"
          letterSpacing="1.5"
          fill="#d9a441"
        >
          {project.category.code}
        </text>
        <path d="M20 142h200M20 138v8M220 138v8" stroke="rgba(195,185,155,0.5)" />
      </svg>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 hud-label whitespace-nowrap">{ui[locale].portfolio.noPhoto}</span>
    </div>
  );
};
