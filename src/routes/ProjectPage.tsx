import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar, Footer, Reveal, AudioPlayer, renderFormatted, type Locale } from '../components';
import { SiteBackdrop } from '../components/ui/SiteBackdrop';
import { ProjectCover } from '../components/portfolio/ProjectCover';
import { Lightbox } from '../components/portfolio/Lightbox';
import { VideoEmbed } from '../components/portfolio/VideoEmbed';
import { IconArrowLeft, IconArrowRight, IconDownload, IconExternal } from '../components/ui/Icons';
import {
  draftsVisible,
  findProject,
  getProjects,
  isExternalHref,
  isSelfCaseStudyLink,
  projectHref,
  toParagraphs,
  type MediaImage,
  type PortfolioProject
} from '../lib/portfolio';
import { buildNavItems } from '../lib/navigation';
import { useSiteLocale } from '../lib/locale';
import { useSpotlight } from '../lib/useSpotlight';
import { ui } from '../lib/strings';

const CTA_CLASS: Record<string, string> = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost'
};

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const el = document.querySelector(selector);
  const previous = el?.getAttribute(attr) ?? null;
  el?.setAttribute(attr, value);
  return () => {
    if (el && previous !== null) el.setAttribute(attr, previous);
  };
};

const Block: React.FC<{ id: string; index: number; title: string; children: React.ReactNode; className?: string }> = ({
  id,
  index,
  title,
  children,
  className = ''
}) => (
  <section id={id} aria-labelledby={`${id}-title`} className={`mt-16 scroll-mt-36 ${className}`}>
    <div className="section-rail" aria-hidden="true">
      <span className="section-rail__index">{String(index).padStart(2, '0')}</span>
      <span className="section-rail__line measure" />
    </div>
    <h2 id={`${id}-title`} className="hud-title text-2xl md:text-3xl mb-6">
      {title}
    </h2>
    {children}
  </section>
);

const Paragraphs: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <div className={`prose-tech ${className}`}>
    {toParagraphs(text).map((p, i) => (
      <p key={i} className="whitespace-pre-line">
        {renderFormatted(p)}
      </p>
    ))}
  </div>
);

const ImageGrid: React.FC<{
  images: MediaImage[];
  locale: Locale;
  onOpen: (index: number) => void;
  columns?: string;
}> = ({ images, locale, onOpen, columns = 'grid-cols-2 md:grid-cols-3' }) => (
  <ul className={`grid gap-3 ${columns}`} role="list">
    {images.map((img, i) => (
      <li key={`${img.src}-${i}`}>
        <figure>
          <button
            type="button"
            className="gallery-thumb"
            onClick={() => onOpen(i)}
            aria-label={ui[locale].project.openImage(i + 1, images.length)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
          </button>
          {img.caption && <figcaption className="mt-2 text-xs text-neutral-400">{img.caption}</figcaption>}
        </figure>
      </li>
    ))}
  </ul>
);

const NotFound: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = ui[locale].project;
  return (
    <div className="panel panel--lg hud-corners mt-16 grid place-items-center gap-5 px-6 py-20 text-center">
      <p className="hud-code">ERR 404 // PORTFOLIO</p>
      <h1 className="hud-title text-3xl md:text-4xl">{t.notFoundTitle}</h1>
      <p className="max-w-md text-neutral-300">{t.notFoundText}</p>
      <Link to="/#projects" className="btn btn--primary">
        <IconArrowLeft size={14} />
        {t.back}
      </Link>
    </div>
  );
};

const ProjectView: React.FC<{
  project: PortfolioProject;
  projects: PortfolioProject[];
  locale: Locale;
}> = ({ project, projects, locale }) => {
  const t = ui[locale];
  const [lightbox, setLightbox] = useState<{ images: MediaImage[]; index: number } | null>(null);

  const ordinal = useMemo(
    () => projects.filter((p) => p.category.id === project.category.id).findIndex((p) => p.slug === project.slug) + 1,
    [projects, project]
  );
  const code = `${project.category.code}-${String(Math.max(ordinal, 1)).padStart(2, '0')}`;

  const position = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects.length > 1 && position >= 0 ? projects[(position - 1 + projects.length) % projects.length] : undefined;
  const next = projects.length > 1 && position >= 0 ? projects[(position + 1) % projects.length] : undefined;

  const cs = project.caseStudy;
  const ctas = (cs?.ctas ?? []).filter((cta) => !isSelfCaseStudyLink(cta.href, project.slug));
  const coverIsPhoto = project.cover && !project.cover.placeholder;
  const coverImages: MediaImage[] = coverIsPhoto ? [{ src: project.cover!.src, alt: project.cover!.alt }, ...project.gallery] : project.gallery;

  const blocks: { id: string; title: string; render: (index: number) => React.ReactNode }[] = [];

  if (project.description || project.specs.length > 0) {
    blocks.push({
      id: 'opis',
      title: project.description ? t.project.description : t.project.specs,
      render: (index) => (
        <Block id="opis" index={index} title={project.description ? t.project.description : t.project.specs}>
          <div className={`grid gap-8 ${project.description && project.specs.length ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]' : ''}`}>
            {project.description && <Paragraphs text={project.description} className="text-[1.02rem] md:text-lg" />}
            {project.specs.length > 0 && (
              <aside className="panel hud-corners p-5 md:p-6" aria-label={t.project.specs} data-spotlight>
                <p className="hud-label mb-3">{t.project.specs}</p>
                <dl>
                  {project.specs.map((spec) => (
                    <div key={`${spec.label}-${spec.value}`} className="spec-row">
                      <dt className="text-sm text-neutral-300">{spec.label}</dt>
                      <dd className="font-mono text-sm text-neutral-50 text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            )}
          </div>
        </Block>
      )
    });
  }

  if (cs && (cs.challenge || cs.approach.length || cs.outcome || cs.metrics.length || cs.audio)) {
    blocks.push({
      id: 'case-study',
      title: t.project.caseStudy,
      render: (index) => (
        <Block id="case-study" index={index} title={t.project.caseStudy}>
          {cs.metrics.length > 0 && (
            <dl className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4" aria-label={t.project.metrics}>
              {cs.metrics.map((m) => (
                <div key={`${m.label}-${m.value}`} className="panel panel--sm p-4" data-spotlight>
                  <dt className="hud-label">{m.label}</dt>
                  <dd className="mt-2 font-heading text-2xl font-semibold text-amber-400 md:text-3xl">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {cs.audio && <AudioPlayer src={cs.audio} title={t.project.audioTitle} type="audio" className="mb-6" />}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {cs.challenge && (
              <article className="panel p-5 md:p-6" data-spotlight>
                <h3 className="hud-code mb-3">{t.project.challenge}</h3>
                <p className="text-neutral-200 leading-relaxed">{cs.challenge}</p>
              </article>
            )}
            {cs.approach.length > 0 && (
              <article className="panel p-5 md:p-6" data-spotlight>
                <h3 className="hud-code mb-3">{t.project.approach}</h3>
                <ol className="space-y-3" role="list">
                  {cs.approach.map((step, i) => (
                    <li key={i} className="flex gap-3 text-neutral-200 leading-relaxed">
                      <span className="mt-0.5 font-mono text-xs text-amber-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            )}
            {cs.outcome && (
              <article className="panel panel--accent p-5 md:p-6" data-spotlight>
                <h3 className="hud-code mb-3">{t.project.outcome}</h3>
                <p className="text-neutral-100 leading-relaxed">{cs.outcome}</p>
              </article>
            )}
          </div>
        </Block>
      )
    });
  }

  if (project.gallery.length > 0) {
    blocks.push({
      id: 'galeria',
      title: t.project.gallery,
      render: (index) => (
        <Block id="galeria" index={index} title={t.project.gallery}>
          <ImageGrid
            images={project.gallery}
            locale={locale}
            onOpen={(i) => setLightbox({ images: project.gallery, index: i })}
            columns="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          />
        </Block>
      )
    });
  }

  if (project.videos.length > 0) {
    blocks.push({
      id: 'filmy',
      title: t.project.videos,
      render: (index) => (
        <Block id="filmy" index={index} title={t.project.videos}>
          <ul className={`grid gap-5 ${project.videos.length > 1 ? 'md:grid-cols-2' : 'max-w-4xl'}`} role="list">
            {project.videos.map((video) => (
              <li key={video.url} className="panel panel--sm p-2">
                <VideoEmbed video={video} locale={locale} />
                <p className="px-2 pb-1 pt-3 text-sm text-neutral-200">{video.title}</p>
              </li>
            ))}
          </ul>
        </Block>
      )
    });
  }

  if (project.stages.length > 0) {
    blocks.push({
      id: 'etapy',
      title: t.project.stages,
      render: (index) => (
        <Block id="etapy" index={index} title={t.project.stages}>
          <ol className="stage-list" role="list">
            {project.stages.map((stage, i) => (
              <li key={`${stage.title}-${i}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
                <span className="stage-node" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="panel p-5" data-spotlight>
                  {stage.date && <p className="hud-label mb-1">{stage.date}</p>}
                  <h3 className="font-heading text-lg font-semibold text-neutral-50">{stage.title}</h3>
                  {stage.description && <Paragraphs text={stage.description} className="mt-2 text-sm" />}
                  {stage.images.length > 0 && (
                    <div className="mt-4">
                      <ImageGrid
                        images={stage.images}
                        locale={locale}
                        onOpen={(idx) => setLightbox({ images: stage.images, index: idx })}
                        columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Block>
      )
    });
  }

  if (project.updates.length > 0) {
    blocks.push({
      id: 'aktualizacje',
      title: t.project.updates,
      render: (index) => (
        <Block id="aktualizacje" index={index} title={t.project.updates}>
          <ul className="grid gap-3" role="list">
            {project.updates.map((update, i) => (
              <li key={`${update.title}-${i}`} className="panel panel--sm grid gap-2 p-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
                <p className="hud-code">{update.date ?? `REV ${String(project.updates.length - i).padStart(2, '0')}`}</p>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-50">{update.title}</h3>
                  {update.description && <Paragraphs text={update.description} className="mt-1 text-sm" />}
                </div>
              </li>
            ))}
          </ul>
        </Block>
      )
    });
  }

  if (project.attachments.length > 0) {
    const imageAttachments = project.attachments.filter((a) => a.isImage);
    const fileAttachments = project.attachments.filter((a) => !a.isImage);
    blocks.push({
      id: 'dokumentacja',
      title: t.project.attachments,
      render: (index) => (
        <Block id="dokumentacja" index={index} title={t.project.attachments}>
          {imageAttachments.length > 0 && (
            <ImageGrid
              images={imageAttachments.map((a) => ({ src: a.href, alt: a.label, caption: `${t.attachmentKind[a.kind]} — ${a.label}` }))}
              locale={locale}
              onOpen={(i) =>
                setLightbox({
                  images: imageAttachments.map((a) => ({ src: a.href, alt: a.label, caption: `${t.attachmentKind[a.kind]} — ${a.label}` })),
                  index: i
                })
              }
            />
          )}
          {fileAttachments.length > 0 && (
            <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${imageAttachments.length ? 'mt-5' : ''}`} role="list">
              {fileAttachments.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    className="panel panel--sm panel--interactive flex items-center gap-4 p-4"
                    {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: '' })}
                    data-spotlight
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-amber-500/50 font-mono text-[0.62rem] text-amber-300">
                      {t.attachmentKind[a.kind].slice(0, 4).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-neutral-50">{a.label}</span>
                      <span className="hud-label">{a.external ? t.project.openLink : t.project.download}</span>
                    </span>
                    {a.external ? <IconExternal size={16} /> : <IconDownload size={16} />}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Block>
      )
    });
  }

  return (
    <article aria-labelledby="project-title">
      <nav aria-label="Breadcrumb" className="mt-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-neutral-400">
          <li>
            <Link to="/" className="hover:text-amber-300">
              {t.project.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/#projects" className="hover:text-amber-300">
              {t.project.breadcrumbPortfolio}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/?kategoria=${encodeURIComponent(project.category.id)}#projects`} className="hover:text-amber-300">
              {project.category.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-sand-400 normal-case tracking-normal font-body text-xs">
            {project.title}
          </li>
        </ol>
      </nav>

      <header className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
        <Reveal>
          <p className="hud-code">{`${code} // ${project.category.label}`}</p>
          <h1 id="project-title" className="mt-4 font-heading text-[clamp(2rem,1.3rem+3vw,3.4rem)] font-semibold leading-[1.05] text-neutral-50">
            {project.title}
          </h1>
          {cs?.tagline && <p className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-sand-400">{cs.tagline}</p>}
          {project.summary && <p className="mt-5 text-lg text-neutral-200 leading-relaxed">{project.summary}</p>}

          <dl className="mt-7 flex flex-wrap gap-2 [&>div]:min-w-[9rem] [&>div]:border [&>div]:border-surface-border">
            <div className="bg-background-elevated px-4 py-3">
              <dt className="hud-label">{t.project.category}</dt>
              <dd className="mt-1 text-sm text-neutral-50">{project.category.label}</dd>
            </div>
            {project.buildStatus && (
              <div className="bg-background-elevated px-4 py-3">
                <dt className="hud-label">{t.project.status}</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm text-neutral-50">
                  <span className="led led--olive" aria-hidden="true" />
                  {t.buildStatus[project.buildStatus]}
                </dd>
              </div>
            )}
            {project.period && (
              <div className="bg-background-elevated px-4 py-3">
                <dt className="hud-label">{t.project.period}</dt>
                <dd className="mt-1 text-sm text-neutral-50">{project.period}</dd>
              </div>
            )}
            {project.status === 'draft' && (
              <div className="bg-amber-500/10 px-4 py-3">
                <dt className="hud-label text-amber-400">{t.project.status}</dt>
                <dd className="mt-1 text-sm text-amber-200">{t.portfolio.draft}</dd>
              </div>
            )}
          </dl>

          {project.technologies.length > 0 && (
            <div className="mt-6">
              <p className="hud-label mb-2">{t.project.technologies}</p>
              <ul className="flex flex-wrap gap-1.5" role="list">
                {project.technologies.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {ctas.map((cta) => {
              const external = isExternalHref(cta.href);
              return (
                <a
                  key={`${cta.label}-${cta.href}`}
                  href={cta.href}
                  className={CTA_CLASS[cta.variant ?? ''] ?? CTA_CLASS.secondary}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {cta.label}
                  {external && <IconExternal size={14} />}
                </a>
              );
            })}
            <Link to="/#contact" className={ctas.some((c) => c.variant === 'primary') ? 'btn btn--ghost' : 'btn btn--primary'}>
              {t.project.contactCta}
              <IconArrowRight size={14} className="btn__arrow" />
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative">
            <div className="media-frame aspect-[4/3]">
              {coverIsPhoto ? (
                <button
                  type="button"
                  className="block h-full w-full cursor-zoom-in"
                  onClick={() => setLightbox({ images: coverImages, index: 0 })}
                  aria-label={t.project.openImage(1, coverImages.length)}
                >
                  <ProjectCover project={project} locale={locale} eager sizes="(min-width: 1024px) 560px, 100vw" />
                </button>
              ) : (
                <ProjectCover project={project} locale={locale} eager sizes="(min-width: 1024px) 560px, 100vw" />
              )}
              <div className="tile__overlay" aria-hidden="true" />
              <div className="tile__crosshair opacity-100" aria-hidden="true" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3" aria-hidden="true">
              <span className="hud-label">{code}</span>
              <span className="measure flex-1 opacity-60" />
              <span className="hud-label">{project.cover?.placeholder ? t.portfolio.placeholderVisual : project.cover ? `IMG 01 / ${String(coverImages.length).padStart(2, '0')}` : 'IMG --'}</span>
            </div>
          </div>
        </Reveal>
      </header>

      {blocks.length > 1 && (
        <nav aria-label={t.project.contents} className="sticky top-16 z-30 -mx-4 mt-12 border-y border-surface-border bg-background-default/90 px-4 py-2 backdrop-blur md:-mx-8 md:px-8 lg:mx-0 lg:border lg:px-3">
          <ul className="flex gap-2 overflow-x-auto" role="list">
            {blocks.map((b, i) => (
              <li key={b.id} className="shrink-0">
                <a href={`#${b.id}`} className="chip">
                  <span className="text-neutral-500">{String(i + 1).padStart(2, '0')}</span>
                  {b.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {blocks.map((b, i) => (
        <React.Fragment key={b.id}>{b.render(i + 1)}</React.Fragment>
      ))}

      {(prev || next) && (
        <nav aria-label={`${t.project.previous} / ${t.project.next}`} className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
          {prev && (
            <Link to={projectHref(prev)} className="panel panel--interactive group flex items-center gap-4 p-5" data-spotlight>
              <IconArrowLeft size={18} className="shrink-0 text-amber-400 transition-transform group-hover:-translate-x-1" />
              <span className="min-w-0">
                <span className="hud-label block">{t.project.previous}</span>
                <span className="mt-1 block truncate font-heading text-lg font-semibold text-neutral-50">{prev.title}</span>
              </span>
            </Link>
          )}
          {next && (
            <Link
              to={projectHref(next)}
              className="panel panel--interactive group flex items-center justify-end gap-4 p-5 text-right md:col-start-2"
              data-spotlight
            >
              <span className="min-w-0">
                <span className="hud-label block">{t.project.next}</span>
                <span className="mt-1 block truncate font-heading text-lg font-semibold text-neutral-50">{next.title}</span>
              </span>
              <IconArrowRight size={18} className="shrink-0 text-amber-400 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </nav>
      )}

      <aside className="panel panel--lg hud-corners mt-10 grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10" data-spotlight>
        <div>
          <p className="hud-code">CONTACT // DAREMON ENGINEERING</p>
          <h2 className="hud-title mt-3 text-2xl md:text-3xl">{t.project.contactTitle}</h2>
          <p className="mt-3 max-w-2xl text-neutral-300">{t.project.contactText}</p>
        </div>
        <Link to="/#contact" className="btn btn--primary">
          {t.project.contactCta}
          <IconArrowRight size={14} className="btn__arrow" />
        </Link>
      </aside>

      <Lightbox
        images={lightbox?.images ?? []}
        index={lightbox?.index ?? null}
        locale={locale}
        onClose={() => setLightbox(null)}
        onIndexChange={(index) => setLightbox((lb) => (lb ? { ...lb, index } : lb))}
      />
    </article>
  );
};

const ProjectPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [locale, setLocale] = useSiteLocale();
  const includeDrafts = useMemo(() => draftsVisible(), []);
  const projects = useMemo(() => getProjects(locale, includeDrafts), [locale, includeDrafts]);
  const project = useMemo(() => findProject(slug, locale, includeDrafts), [slug, locale, includeDrafts]);
  const navItems = useMemo(() => buildNavItems(locale), [locale]);
  const t = ui[locale];
  useSpotlight();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = project ? `${project.title} — Portfolio | Adamski.tech` : `${t.project.notFoundTitle} — Adamski.tech`;
    const restoreDesc = project?.summary ? setMeta('meta[name="description"]', 'content', project.summary) : () => {};
    const restoreCanonical = project
      ? setMeta('link[rel="canonical"]', 'href', `https://adamski.tech${projectHref(project)}`)
      : () => {};
    return () => {
      document.title = previousTitle;
      restoreDesc();
      restoreCanonical();
    };
  }, [project, t]);

  return (
    <>
      <SiteBackdrop />
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:px-3 focus:py-2 focus:bg-surface-card focus:text-neutral-50"
        href="#main"
      >
        {t.skipToContent}
      </a>
      <Navbar labels={navItems} activeId="projects" locale={locale} onLocaleChange={setLocale} basePath="/" />
      <main id="main" className="max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12">
        {project ? <ProjectView project={project} projects={projects} locale={locale} /> : <NotFound locale={locale} />}
        <Footer year={new Date().getFullYear()} labels={navItems} locale={locale} basePath="/" />
      </main>
    </>
  );
};

export default ProjectPage;
