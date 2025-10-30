MVP plan for Adamski.tech (React + Vite + Tailwind, TypeScript)

Goal
- One-page landing with sections: Hero, About, Skills, Projects, Contact
- Sticky navbar with active section highlight, smooth scroll, reveal animations
- Language switcher PL/EN/NL with runtime meta updates
- Dark, industrial futurism style mapped from design.json (Tailwind theme.extend)
- No backend; content.json and design.json loaded locally

Files to create (<=8 src files)
1) package.json — project scripts and dependencies
2) tsconfig.json — TypeScript config (supports JSON imports)
3) postcss.config.js — Tailwind + Autoprefixer
4) tailwind.config.js — theme.extend mapped from design/design.json (colors, fonts, shadows, gradients, motion, radii)
5) index.html — base HTML, meta, fonts, root div, noscript
6) src/index.css — Tailwind directives and base utilities (smooth scroll, focus-visible, custom scrollbars, reveal utilities)
7) src/components.tsx — consolidated components (Navbar, Footer, SectionHeading, ProjectCard, SkillTag, LanguageSwitcher, Reveal)
8) src/App.tsx — app structure, sections, locale context, IntersectionObserver, runtime meta updates
9) src/main.tsx — React entry; imports index.css (Total src files: 4)

Relations
- App.tsx imports content/content.json and uses components from components.tsx
- tailwind.config.js requires design/design.json to map tokens into Tailwind theme.extend
- index.html loads fonts and boots /src/main.tsx
- index.css provides Tailwind layers plus accessibility utilities and reveal styles

Assumptions
- Placeholder images and links will be provided later (TODO in content.json)
- Contact uses mailto without backend
- Languages default to PL; user preference stored in localStorage("locale")