# Adamski.tech

> **Cyfrowa wizytówka inżyniera automatyki**, która pokazuje, że techniczne kompetencje można prezentować z elegancją i dbałością o szczegóły.

---

## Wizja Projektu

W świecie, gdzie profile LinkedIn stały się standardem, a portfolia inżynierskie często ograniczają się do list umiejętności i CV w PDF, **Adamski.tech** idzie inną drogą.

To nie jest kolejna landing page. To **manifest podejścia do inżynierii** — miejsce, gdzie techniczny minimalizm spotyka się z industrial futurism, gdzie każdy element ma swoje "dlaczego", a kod jest równie dopracowany jak interfejs użytkownika.

### Dla kogo?

**Dla potencjalnych partnerów biznesowych**, którzy szukają kogoś więcej niż CV — chcą zobaczyć sposób myślenia, metodologię, konkretne realizacje.

**Dla firm technologicznych**, które cenią nie tylko wiedzę inżynierską, ale także umiejętność jej komunikacji — wielojęzyczność (PL/EN/NL), dostępność (WCAG AA), responsywność.

**Dla mnie samego** — jako platforma, która ewoluuje wraz ze mną. Nie statyczny dokument, ale żywy system, który można rozbudowywać, aktualizować, eksperymentować.

---

## Filozofia Projektu

### 1. **Single Source of Truth**

Cała identyfikacja wizualna — kolory, typografia, cienie, gradienty — żyje w `design/design.json`. Tailwind jest tylko warstwą prezentacji. Zmiana primary blue z `#3b82f6` na inny odcień? Jeden plik, jeden commit.

To samo z treścią: 3096 linii w `content/content.json` obsługuje trzy języki (PL/EN/NL). Konsystencja, wersjonowanie, łatwość aktualizacji.

**Dlaczego to ważne?** Bo design system to nie zbiór przypadkowych wartości hex w plikach CSS. To architektura decyzyjna, która ogranicza chaos i pozwala skalować bez rozsypywania się kodu.

### 2. **Accessibility jako fundament, nie dodatek**

WCAG AA nie jest checkboxem na liście przed deployem. To założenie architektoniczne od pierwszej linii kodu:
- Semantyczny HTML5 (header, nav, main, section, article)
- ARIA roles, labels, live regions
- Pełna obsługa klawiatury (Tab, Arrow, Home/End) z WAI-ARIA Tabs Pattern
- Focus indicators (ring-2 ring-primary-500)
- Support dla `prefers-reduced-motion`
- Screen reader optimization

**Dlaczego to ważne?** Bo dostępność to nie feature request. To obowiązek profesjonalisty wobec użytkowników — wszystkich użytkowników.

### 3. **Performance przez design, nie optymalizację post-factum**

Vite zamiast Webpack. TypeScript strict mode od początku. Intersection Observer dla scroll reveals zamiast ciężkich bibliotek animacji. SVG charts zamiast Chart.js (320px radar vs. 50KB library).

No backend, no database, no serverless functions. Statyczny hosting (Netlify/Nginx), CDN, HTTPS. Mailto form zamiast API endpoint.

**Dlaczego to ważne?** Bo performance to UX. Każde 100ms opóźnienia to utracona uwaga użytkownika. Fast by default, nie fast after profiling.

### 4. **Industrial futurism as design language**

Dark mode jako default (rich black `#0b0f14`). LED blue accent (`#3b82f6`). Minimalistyczne karty. Glow effects. Monospace fonty (JetBrains Mono) dla detali technicznych.

To nie jest przypadkowy wybór estetyczny. To **komunikat**: inżynieria to nie tylko Excel i PLC. To także wizja, precyzja, elegancja.

**Dlaczego to ważne?** Bo brand to nie logo. To konsekwencja decyzji — od wyboru kolorów, przez tone of voice, po architekturę kodu.

### 5. **Progressive enhancement i resilience**

Auto-detect języka z `navigator.language`, fallback na PL. LocalStorage dla preferencji, ale graceful degradation bez JS. Semantic HTML działający nawet gdy CSS nie załaduje się.

Redirect handling dla `/qr/biz` (landing z wizytówki QR) i `/hans` (dedicated partner page). Meta tags dynamicznie zarządzane dla SEO.

**Dlaczego to ważne?** Bo profesjonalne rozwiązania działają wszędzie — na iPhone 15 Pro, na starym Androidzie, w czytnikach ekranu, w przypadkowych edycjach offline.

---

## Najważniejsze Rozwiązania Techniczne

### 1. **Custom SVG Radar Chart**

Zamiast 50KB biblioteki — 172 linie czystego TypeScripta generującego dynamiczny radar z 3+ osiami, 4 poziomami koncentricznych polygonów, tooltipem na hover.

**Challenge:** Wizualizacja kompetencji w sposób intuicyjny i responsive.
**Solution:** Pure SVG math — obliczanie kątów (`angleSlice = Math.PI * 2 / axes.length`), normalizacja wartości (`value/max`), positioning labels.
**Impact:** Zero dependencies, pełna kontrola, instant loading.

**Lokalizacja:** `src/components/RadarChart.tsx`

### 2. **Multilingual Content Architecture**

3096 linii JSON (content.json) obsługujących 3 języki bez i18n library. Locale context w React, localStorage persistence, auto-detect z `navigator.language`.

**Challenge:** Pełna wielojęzyczność bez vendor lock-in (react-i18next, i18next).
**Solution:** Content as data, React context, simple `content[locale].section.key` access pattern.
**Impact:** Łatwa translacja (przekaż JSON tłumaczowi), zero runtime overhead, version control friendly.

**Lokalizacja:** `content/content.json`, `src/App.tsx:52-68`

### 3. **Interactive Career Timeline z Date Parserem**

Parser dat obsługujący format "Jan 2016 – Present" w trzech językach (PL: "styczeń", EN: "January", NL: "januari"). Chronologiczne sortowanie, duration calculation (months between dates).

**Challenge:** Multilingwalny timeline bez hardcoded miesięcy w kodzie.
**Solution:** Dynamic month mapping per locale, Intl.DateTimeFormat, timestamp conversion, relative positioning w vertical timeline.
**Impact:** Automatyczna chronologia, support dla "Present" jako current date, responsywny design.

**Lokalizacja:** `src/components/InteractiveTimeline.tsx:12-56`

### 4. **Audio/Video Player w Sekcjach**

Custom media player (controls: play/pause, seek bar, currentTime/duration) z obsługą audio (MP3, WAV, OGG) i video (MP4, WebM) bez external libraries.

**Challenge:** Audialne storytelling (narracja do sekcji "About", "Projects", "Equipment") bez YouTube embeds czy Soundcloud iframes.
**Solution:** Native `<audio>`/`<video>` API, custom React controls, event handlers (`loadedMetadata`, `timeUpdate`, `ended`).
**Impact:** Privacy-first (no tracking), offline-capable, minimal bandwidth.

**Lokalizacja:** `src/components/AudioPlayer.tsx`, użycie w `src/App.tsx:734, 888, 1023`

### 5. **Keyboard Navigation (WAI-ARIA Tabs Pattern)**

Pełna obsługa klawiatury dla tab panel'u kompetencji: ArrowLeft/Right (next/prev), Home (first), End (last), `aria-selected`, `tabindex`, auto-focus.

**Challenge:** Accessibility dla interactive components bez bibliotek (React Aria, Radix UI).
**Solution:** useCallback hooks, refs array (`tabRefs.current[index]?.focus()`), ARIA attributes, keyboard event handlers.
**Impact:** Screen reader friendly, poweruser efficiency, WCAG 2.1 Level AA compliance.

**Lokalizacja:** `src/App.tsx:152-196`

---

## Dlaczego Ten Stos Technologiczny?

### React 18.3 + TypeScript 5.6
**Decyzja:** Type safety + modern hooks (useState, useEffect, useMemo, useCallback).
**Alternatywy rozważane:** Vue 3 (mniej boilerplate), Svelte (mniejszy bundle), Vanilla JS (zero deps).
**Dlaczego React?** Ekosystem, hiring pool (łatwiej znaleźć kogoś do maintenance), TypeScript integration, Vite support.

### Vite 5.4
**Decyzja:** Lightning-fast dev server (HMR <100ms), optimized build (Rollup), zero-config ESM.
**Alternatywy rozważane:** Webpack (mature, wielki), Parcel (zero config), Turbopack (bleeding edge).
**Dlaczego Vite?** Developer Experience. Hot Module Replacement jest instant. Build time: ~3s vs. 20s+ w Webpack. ESM native.

### Tailwind CSS 3.4
**Decyzja:** Utility-first, design tokens integration, minimal custom CSS.
**Alternatywy rozważane:** Styled Components (CSS-in-JS), Sass (preprocessor), Vanilla CSS (pure).
**Dlaczego Tailwind?** Consistency przez constraints. Klasy jak `text-text-primary` zamiast `color: #eaeaea` 50 razy. `design.json` → Tailwind config = single source of truth.

### React Router DOM 7.9
**Decyzja:** Client-side routing dla `/qr/biz`, `/hans` landing pages.
**Alternatywy rozważane:** No routing (pure SPA), Tanstack Router (type-safe), Wouter (minimal).
**Dlaczego React Router?** Industry standard. SEO support (meta tags management). Dedykowane landings dla QR code i partner pages.

### No Backend, No Database
**Decyzja:** Static site, mailto form, CDN hosting (Netlify), zero server maintenance.
**Alternatywy rozważane:** Next.js (SSR), Astro (SSG + islands), Express backend (contact form API).
**Dlaczego static?** Cost (free hosting), security (no SQL injection), speed (CDN edge), resilience (no downtime). Dla portfolio = overkill mieć backend.

---

## Quick Start

### Wymagania
- Node.js 18+
- npm lub pnpm

### Instalacja i dev server
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Build produkcyjny
```bash
npm run build
# Output: dist/
```

### Deployment
**Netlify (zalecane):**
```bash
# Build command: npm run build
# Publish directory: dist
# public/_redirects obsługuje SPA routing + custom redirects
```

**Nginx:** Zobacz `deployment/deployment_plan.md` (HTTPS Let's Encrypt, gzip, cache headers).

---

## Architektura i Dokumentacja

- **Code Structure:** `src/App.tsx` (1098 linii — core logic), `src/components/` (specjalistyczne komponenty)
- **Content Management:** `content/content.json` (3096 linii — treści PL/EN/NL)
- **Design System:** `design/design.json` → Tailwind config (kolory, typografia, shadows, gradienty)
- **UX/UI Spec:** `architecture/ux_structure.md` (pełna dokumentacja architektury)
- **Deployment:** `deployment/deployment_plan.md` (Nginx config, SSL, redirects)
- **Mockups:** `design/mockups.md` (wizualne specyfikacje)

### Kluczowe komponenty
| Komponent | Lokalizacja | Opis |
|-----------|-------------|------|
| RadarChart | `src/components/RadarChart.tsx` | SVG radar chart umiejętności (0-max normalizacja, 4 ringi) |
| InteractiveTimeline | `src/components/InteractiveTimeline.tsx` | Timeline kariery z parserem dat (PL/EN/NL) |
| AudioPlayer | `src/components/AudioPlayer.tsx` | Custom media player (audio/video) |
| CVDownload | `src/components/CVDownload.tsx` | Dropdown menu (3 PDF: PL/EN/NL) |
| SkillsOverview | `src/components/SkillsOverview.tsx` | Wrapper dla RadarChart + kategorie |
| QRBiz | `src/routes/QRBiz.tsx` | Landing page dla QR code z wizytówki |
| Hans | `src/routes/Hans.tsx` | Dedicated partner landing page |

---

## Sekcje Strony

1. **Hero** — Animowany background (dual-track scroll), pulse badge, 3 CTA
2. **About** — 4 karty (grid responsive), emoji icons, markdown support
3. **Career Timeline** — Interactive timeline z date parserem, milestones
4. **Skills** — Tab interface + radar chart + highlights (keyboard accessible)
5. **Projects** — Portfolio z filtrowaniem (skill chips), audio players, metrics
6. **AI Methodology** — Metryki, workflow diagram, automation layer
7. **Equipment Inventory** — Sprzęt inżynierski (PLC, hydraulika, pneumatyka)
8. **Daremon Brand** — Filozofia, serwisy, deliverables
9. **Partners** — Karty partnerskie (value prop, ideal for, highlights)
10. **Contact** — Mailto form (pre-filled), kanały kontaktu, env var support

---

## Development Philosophy

### Code Quality
- TypeScript strict mode (`tsconfig.json:13`)
- Semantic HTML5 (header, nav, main, section, article, footer)
- Consistent naming (camelCase components, kebab-case CSS classes)
- Single Responsibility Principle (komponenty <200 linii gdy możliwe)

### Performance Budget
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <200KB (gzipped)
- Lighthouse score: 90+ (Performance, Accessibility, Best Practices, SEO)

### Pre-commit Checklist
- [ ] `npm run lint` passes (TypeScript compilation)
- [ ] `npm run build` successful
- [ ] Test mobile viewport (Chrome DevTools)
- [ ] Verify wszystkie języki (PL/EN/NL switcher)
- [ ] Keyboard navigation (Tab, Arrow, Enter, Escape)
- [ ] Screen reader test (VoiceOver/NVDA)

---

## Known Issues & Improvements

### Current
- 2 moderate severity npm audit warnings (peer dependencies — not exploitable in static site context)
- React Router "use client" directive warnings (harmless, planned fix w React 19)

### Roadmap
- [ ] Blog section (markdown-based, local-first)
- [ ] Dark/Light mode toggle (currently dark-only)
- [ ] Analytics (privacy-first — Plausible/Fathom, no Google)
- [ ] Contact form backend (optional serverless function dla notification)
- [ ] PWA support (offline capability, install prompt)
- [ ] OpenGraph images (dynamic per route)

---

## Kontakt

- **Website:** https://adamski.tech
- **Email:** contact@adamski.tech
- **LinkedIn:** [Zobacz content.json dla aktualnego linku]
- **QR Landing:** https://adamski.tech/qr/biz

---

## Licencja

Projekt prywatny — **Dariusz Adamski** © 2024
Kod dostępny w celach demonstracyjnych. Wykorzystanie komercyjne wymaga zgody autora.

---

**Zaprojektowano w duchu industrial futurism.**
*Gdzie inżynieria spotyka się z elegancją kodu.*
