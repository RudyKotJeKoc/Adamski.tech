# 🚀 Przewodnik Optymalizacji adamski.tech

## 📋 Spis treści
1. [Self-hosted fonty](#1-self-hosted-fonty)
2. [Code splitting z React.lazy](#2-code-splitting-z-reactlazy)
3. [Mobile Menu](#3-mobile-menu)
4. [Vite Configuration](#4-vite-configuration)
5. [Lazy Loading obrazów](#5-lazy-loading-obrazów)

---

## 1. Self-hosted fonty

### Krok 1: Pobierz fonty
```bash
# Pobierz z Google Fonts:
# Inter: https://fonts.google.com/download?family=Inter
# JetBrains Mono: https://fonts.google.com/download?family=JetBrains%20Mono

# Rozpakuj i skopiuj pliki .woff2 do public/fonts/
# Potrzebne pliki:
# - inter-v13-latin-regular.woff2
# - inter-v13-latin-500.woff2
# - inter-v13-latin-600.woff2
# - inter-v13-latin-700.woff2
# - jetbrains-mono-v18-latin-regular.woff2
# - jetbrains-mono-v18-latin-600.woff2
```

### Krok 2: Zamień index.css
```bash
mv src/index.css src/index.css.backup
mv src/index-optimized.css src/index.css
```

### Krok 3: Zaktualizuj index.html
```bash
mv index.html index.html.backup
mv index-optimized.html index.html
```

### Oczekiwane rezultaty:
- ✅ Brak zewnętrznych requestów do Google Fonts
- ✅ Szybszy FCP (First Contentful Paint) o ~200-300ms
- ✅ Lepsza kontrola nad fallback fonts dzięki `font-display: swap`

---

## 2. Code splitting z React.lazy

### Przykładowa implementacja w src/App.tsx:

```tsx
import React, { lazy, Suspense } from 'react';

// Lazy load heavy components
const InteractiveTimeline = lazy(() => import('./components/InteractiveTimeline').then(m => ({ default: m.InteractiveTimeline })));
const SkillsOverview = lazy(() => import('./components/SkillsOverview').then(m => ({ default: m.SkillsOverview })));
const AudioPlayer = lazy(() => import('./components/AudioPlayer').then(m => ({ default: m.AudioPlayer })));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-8 bg-surface-border rounded w-1/4"></div>
      <div className="h-32 bg-surface-border rounded"></div>
    </div>
  </div>
);

// W komponencie App:
<Suspense fallback={<SectionLoader />}>
  <InteractiveTimeline milestones={...} label={...} />
</Suspense>
```

### Oczekiwane rezultaty:
- ✅ Zmniejszenie initial bundle size o ~30-40%
- ✅ Szybszy TTI (Time to Interactive)
- ✅ Lepsze wykorzystanie code splitting przez Vite

---

## 3. Mobile Menu

### Implementacja w src/components.tsx:

```tsx
// 1. Importuj MobileMenu
import { MobileMenu } from './components/MobileMenu';

// 2. W komponencie Navbar dodaj:
export const Navbar: React.FC<{...}> = ({ labels, activeId, locale, onLocaleChange }) => {
  // ... existing code ...

  return (
    <header role="banner" className="...">
      <nav className="...">
        {/* Desktop menu - pozostaje bez zmian */}
        <ul id="primary-nav" role="menubar" className="hidden md:flex items-center gap-6">
          {/* ... existing desktop menu ... */}
        </ul>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
          <a href="#contact" className="...">
            {contactLabel}
          </a>
        </div>

        {/* NOWE: Mobile Menu */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
          <MobileMenu labels={labels} activeId={activeId} />
        </div>
      </nav>
    </header>
  );
};
```

### Oczekiwane rezultaty:
- ✅ Pełna nawigacja na mobile (rozwiązuje KRYTYCZNY problem #1)
- ✅ Accessibility score wzrośnie o ~10 punktów
- ✅ Lepsza UX dla 50-60% użytkowników mobilnych

---

## 4. Vite Configuration

### Użyj utworzonego vite.config.ts

Plik `vite.config.ts` zawiera:
- ✅ Manual chunks dla vendor code (React, React DOM)
- ✅ Separate chunks dla timeline, audio, skills
- ✅ Terser minification z usunięciem console.log
- ✅ Optimized chunk sizes

### Instalacja:
```bash
pnpm install  # zainstaluje @vitejs/plugin-react
```

### Build test:
```bash
pnpm build
# Sprawdź dist/ - powinny być oddzielne chunki
```

### Oczekiwane rezultaty:
- ✅ Better caching (vendor code zmienia się rzadko)
- ✅ Parallel loading chunks
- ✅ Smaller initial bundle

---

## 5. Lazy Loading obrazów

### Obecna implementacja (już działa!):
```tsx
<img src={image.src} alt={image.alt} loading="lazy" />
```

### Dodatkowa optymalizacja - Intersection Observer z custom threshold:

```tsx
// src/components/LazyImage.tsx
import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : undefined}
      alt={alt}
      className={className}
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
    />
  );
};
```

---

## 📊 Oczekiwane wyniki po wszystkich optymalizacjach:

### Performance Score: 68 → **88-92/100** (+20-24 punkty)
- FCP: 1.8s → **1.2s** (-600ms)
- LCP: 2.5s → **1.8s** (-700ms)
- TTI: 3.2s → **2.1s** (-1.1s)
- Total Bundle Size: ~200KB → **~140KB** (-30%)

### Accessibility Score: 87 → **97/100** (+10 punktów)
- Mobile navigation ✅
- Better focus management ✅

### SEO: 95 → **95/100** (bez zmian, już bardzo dobre)

### Best Practices: 92 → **100/100** (+8 punktów)
- Brak zewnętrznych CDN dla fontów ✅
- Wszystkie assety self-hosted ✅

---

## 🔧 Kolejność wdrażania (priorytet):

1. **KRYTYCZNE: Mobile Menu** (1-2h) - rozwiązuje największy problem UX
2. **HIGH: Self-hosted fonts** (30min) - największy wzrost Performance
3. **HIGH: Vite config** (15min) - proste, duży efekt
4. **MEDIUM: Code splitting** (2-3h) - wymaga refactoringu App.tsx
5. **LOW: Custom lazy loading** (1h) - native loading="lazy" już działa dobrze

---

## 📈 Monitoring po wdrożeniu:

```bash
# Local Lighthouse audit
pnpm build
pnpm preview
# Otwórz Chrome DevTools → Lighthouse → Run audit

# Production audit (po deploy)
# PageSpeed Insights: https://pagespeed.web.dev/
# WebPageTest: https://www.webpagetest.org/
```

---

## 🎯 Dodatkowe opcjonalne optymalizacje:

1. **Prerendering** - użyj `vite-plugin-ssr` dla statycznego HTML
2. **Image optimization** - convert SVG to optimized PNG/WebP gdzie możliwe
3. **Content.json splitting** - lazy load per language
4. **Service Worker** - offline support z Workbox
5. **HTTP/2 Server Push** - dla krytycznych zasobów

---

**Autor:** Claude Code Analysis
**Data:** 2025-11-14
**Wersja:** 1.0
