import React from 'react';
import { Link } from 'react-router-dom';
import { projectHref, type PortfolioProject } from '../../lib/portfolio';
import { ui } from '../../lib/strings';
import type { Locale } from '../../components';
import { ProjectCover } from './ProjectCover';
import { IconArrowRight } from '../ui/Icons';

type ProjectTileProps = {
  project: PortfolioProject;
  locale: Locale;
  ordinal: number;
  wide?: boolean;
  delay?: number;
};

export const ProjectTile: React.FC<ProjectTileProps> = ({ project, locale, ordinal, wide = false, delay = 0 }) => {
  const t = ui[locale];
  const code = `${project.category.code}-${String(ordinal).padStart(2, '0')}`;

  return (
    <article
      className={`panel panel--interactive tile tile-enter ${wide ? 'tile--wide md:col-span-2' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      data-spotlight
    >
      <div className="tile__media">
        <ProjectCover
          project={project}
          locale={locale}
          sizes={wide ? '(min-width: 1280px) 760px, (min-width: 768px) 90vw, 100vw' : '(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw'}
        />
        <div className="tile__overlay" aria-hidden="true" />
        <div className="tile__crosshair" aria-hidden="true" />
        <div className="tile__badges">
          <span className="tile__chip text-amber-300" aria-hidden="true">
            {code}
          </span>
          <span className="flex flex-wrap justify-end gap-1.5">
            {project.status === 'draft' && <span className="tile__chip border-amber-500/70 text-amber-300">{t.portfolio.draft}</span>}
            {project.buildStatus && (
              <span className="tile__chip">
                <span className="led led--olive" aria-hidden="true" />
                {t.buildStatus[project.buildStatus]}
              </span>
            )}
          </span>
        </div>
        {project.cover?.placeholder && (
          <span className="tile__chip absolute bottom-2.5 left-2.5 text-neutral-400">{t.portfolio.placeholderVisual}</span>
        )}
      </div>

      <div className="tile__body">
        <p className="hud-label">
          {project.category.label}
          {project.period && <span className="text-neutral-500">{` · ${project.period}`}</span>}
        </p>
        <h3 className={`tile__title hud-title leading-tight ${wide ? 'text-2xl' : 'text-xl'}`}>
          <Link to={projectHref(project)}>{project.title}</Link>
        </h3>
        {project.summary && (
          <p className={`text-neutral-300 ${wide ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>{project.summary}</p>
        )}
        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" role="list">
            {project.technologies.slice(0, wide ? 6 : 4).map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <span className="tile__more mt-auto pt-2" aria-hidden="true">
          {t.portfolio.details}
          <IconArrowRight size={14} className="btn__arrow" />
        </span>
      </div>
    </article>
  );
};
