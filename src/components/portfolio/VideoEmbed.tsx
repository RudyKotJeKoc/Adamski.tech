import React, { useState } from 'react';
import { isExternalHref, type ProjectVideo } from '../../lib/portfolio';
import { ui } from '../../lib/strings';
import type { Locale } from '../../components';
import { IconExternal, IconPlay } from '../ui/Icons';

const LOCAL_VIDEO = /\.(mp4|webm|ogv)(\?.*)?$/i;

/** YouTube ładuje się dopiero po kliknięciu (lżejsza strona, brak ciasteczek przed zgodą widza). */
export const VideoEmbed: React.FC<{ video: ProjectVideo; locale: Locale }> = ({ video, locale }) => {
  const [playing, setPlaying] = useState(false);
  const t = ui[locale].project;

  if (video.youtubeId) {
    if (playing) {
      return (
        <iframe
          className="aspect-video w-full bg-background-deep"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      );
    }
    return (
      <button type="button" className="video-facade group" onClick={() => setPlaying(true)} aria-label={t.playVideo(video.title)}>
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        <span className="video-facade__play" aria-hidden="true">
          <IconPlay size={26} />
        </span>
      </button>
    );
  }

  if (!isExternalHref(video.url) && LOCAL_VIDEO.test(video.url)) {
    return <video className="aspect-video w-full bg-background-deep" src={video.url} controls preload="metadata" title={video.title} />;
  }

  return (
    <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
      {t.openVideo}
      <IconExternal size={14} />
    </a>
  );
};
