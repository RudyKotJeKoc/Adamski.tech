import React from 'react';

export const SiteBackdrop: React.FC = () => (
  <div className="site-backdrop" aria-hidden="true">
    <div className="site-backdrop__grid" />
    <div className="site-backdrop__scan" />
    <div className="site-backdrop__noise" />
    <div className="site-backdrop__vignette" />
  </div>
);
