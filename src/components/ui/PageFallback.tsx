import React from 'react';
import { SiteBackdrop } from './SiteBackdrop';

export const PageFallback: React.FC = () => (
  <>
    <SiteBackdrop />
    <div className="min-h-screen grid place-items-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 hud-label">
        <span className="led led--blink" aria-hidden="true" />
        <span>Adamski.tech // loading</span>
      </div>
    </div>
  </>
);
