import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading, Reveal, type Locale } from '../../components';
import { projectHref, type PortfolioProject } from '../../lib/portfolio';
import { ui } from '../../lib/strings';
import { VideoEmbed } from '../portfolio/VideoEmbed';
import { IconArrowRight, IconExternal, IconPlay } from '../ui/Icons';

type MediaSectionProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  content: { title: string; subtitle?: string };
  locale: Locale;
  index: string;
  channelUrl?: string;
  projects: PortfolioProject[];
};

export const MediaSection: React.FC<MediaSectionProps> = ({ sectionRef, content, locale, index, channelUrl, projects }) => {
  const t = ui[locale];

  const videos = useMemo(
    () => projects.flatMap((p) => p.videos.map((video) => ({ video, project: p }))),
    [projects]
  );

  const channelProject = useMemo(
    () => (channelUrl ? projects.find((p) => p.caseStudy?.ctas.some((c) => c.href === channelUrl)) : undefined),
    [projects, channelUrl]
  );

  const handle = channelUrl?.match(/@[\w.-]+/)?.[0];

  return (
    <section id="media" ref={sectionRef as React.Ref<HTMLElement>} aria-labelledby="media-title" className="section mt-28">
      <SectionHeading id="media-title" title={content.title} subtitle={content.subtitle} index={index} code="SEC/MEDIA" />

      {channelUrl && (
        <Reveal>
          <article className="panel panel--lg hud-corners overflow-hidden [clip-path:var(--chamfer)]" data-spotlight>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block min-h-[15rem] overflow-hidden border-b border-surface-border lg:border-b-0 lg:border-r focus-visible:ring-inset focus-visible:ring-offset-0"
                aria-label={`${t.media.channel}${handle ? ` ${handle}` : ''}`}
              >
                <div className="blueprint absolute inset-0" aria-hidden="true">
                  <svg viewBox="0 0 320 180" className="h-full w-full">
                    <rect x="40" y="30" width="240" height="120" fill="rgba(20,24,21,0.85)" stroke="rgba(142,154,103,0.6)" />
                    <path d="M40 46h240M40 134h240" stroke="rgba(142,154,103,0.3)" />
                    {Array.from({ length: 24 }, (_, i) => (
                      <rect
                        key={i}
                        x={52 + i * 9.5}
                        y={112 - ((i * 37) % 48)}
                        width="5"
                        height={14 + ((i * 37) % 48)}
                        fill={i % 6 === 0 ? 'rgba(217,164,65,0.7)' : 'rgba(142,154,103,0.45)'}
                      />
                    ))}
                    <text x="52" y="41" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#c3b99b" letterSpacing="2">
                      CH.01 // BROADCAST
                    </text>
                  </svg>
                </div>
                <span className="video-facade__play transition-transform group-hover:scale-105" aria-hidden="true">
                  <IconPlay size={26} />
                </span>
                <span className="absolute bottom-3 left-3 flex items-center gap-2 tile__chip">
                  <span className="led led--blink" aria-hidden="true" />
                  YouTube
                </span>
              </a>

              <div className="flex flex-col gap-5 p-6 md:p-8">
                <div>
                  <p className="hud-code">{t.media.channel}</p>
                  <h3 className="hud-title mt-2 text-2xl md:text-3xl">{handle ?? channelProject?.title ?? 'YouTube'}</h3>
                  {channelProject?.summary && <p className="mt-3 text-neutral-300">{channelProject.summary}</p>}
                </div>
                {channelProject?.caseStudy?.metrics.length ? (
                  <dl className="grid grid-cols-3 gap-px border border-surface-border bg-surface-border">
                    {channelProject.caseStudy.metrics.map((m) => (
                      <div key={m.label} className="bg-background-elevated px-3 py-3">
                        <dt className="hud-label text-[0.6rem]">{m.label}</dt>
                        <dd className="mt-1 font-heading text-xl font-semibold text-amber-400">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                    {channelProject?.caseStudy?.ctas.find((c) => c.href === channelUrl)?.label ?? t.media.channel}
                    <IconExternal size={14} />
                  </a>
                  {channelProject && (
                    <Link to={projectHref(channelProject)} className="btn btn--ghost">
                      {t.media.caseStudy}
                      <IconArrowRight size={14} className="btn__arrow" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      )}

      {videos.length > 0 && (
        <div className="mt-10">
          <p className="hud-label mb-4">{t.media.videosTitle}</p>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="list">
            {videos.map(({ video, project }) => (
              <li key={`${project.slug}-${video.url}`} className="panel panel--sm p-2" data-spotlight>
                <VideoEmbed video={video} locale={locale} />
                <div className="px-2 pb-2 pt-3">
                  <p className="text-sm text-neutral-100">{video.title}</p>
                  <Link to={projectHref(project)} className="mt-1 inline-flex items-center gap-2 hud-label hover:text-amber-300">
                    {`${t.media.fromProject}: ${project.title}`}
                    <IconArrowRight size={12} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
