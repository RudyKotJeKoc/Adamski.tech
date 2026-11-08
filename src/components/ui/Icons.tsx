import React from 'react';

type IconProps = { className?: string; size?: number };

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ className, size = 16, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    {children}
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
);

export const IconArrowLeft: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const IconChevronDown: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const IconChevronLeft: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const IconChevronRight: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);

export const IconClose: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const IconPlay: React.FC<IconProps> = (p) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={p.className}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

export const IconExternal: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
  </Svg>
);

export const IconDownload: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Svg>
);

export const IconIndex: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 5h4v4H4zM10 7h10M4 15h4v4H4zM10 17h10" />
  </Svg>
);

export const IconMenu: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h10M4 17h16" />
  </Svg>
);
