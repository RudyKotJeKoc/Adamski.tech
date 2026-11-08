import React from 'react';
import { Link } from 'react-router-dom';

type SectionLinkProps = { sectionId: string; basePath?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>;

/** Link do sekcji strony głównej: kotwica na stronie głównej, link routera na podstronach. */
export const SectionLink: React.FC<SectionLinkProps> = ({ sectionId, basePath, children, ...rest }) =>
  basePath ? (
    <Link to={sectionId === 'hero' ? basePath : `${basePath}#${sectionId}`} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={`#${sectionId}`} {...rest}>
      {children}
    </a>
  );
