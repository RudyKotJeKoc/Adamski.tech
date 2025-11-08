# Adamski.tech

Profesjonalna wizytówka inżyniera automatyki i utrzymania ruchu — Dariusz Adamski (Daremon Engineering).

## 📋 O projekcie

Adamski.tech to nowoczesna, interaktywna strona internetowa typu one-page, zaprojektowana w stylu technicznego minimalizmu z akcentami industrial futurism. Projekt łączy profesjonalizm z nowoczesnymi technologiami webowymi, oferując responsywny interfejs dostępny w trzech językach: polskim, angielskim i holenderskim.

### Główne cechy

- 🌐 **Wielojęzyczność**: Pełne wsparcie dla języków PL/EN/NL z dynamiczną zmianą treści
- 🎨 **Nowoczesny design**: Dark mode, gradienty LED, animacje scroll-reveal
- 📱 **Mobile-first**: Responsywny design działający na wszystkich urządzeniach
- ♿ **Dostępność**: Zgodność z WCAG AA, pełna obsługa klawiatury, semantyczny HTML
- ⚡ **Wydajność**: Optymalizacja obrazów, lazy loading, minimalne bundle size
- 🔧 **Professional**: Portfolio projektów, szczegółowe umiejętności, dane kontaktowe

## 🛠️ Stack technologiczny

### Frontend
- **React 18.3** - Biblioteka UI
- **TypeScript 5.6** - Typowanie statyczne
- **Vite 5.4** - Build tool i dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router DOM 7.9** - Routing

### Narzędzia deweloperskie
- **PostCSS** - Transformacja CSS
- **Autoprefixer** - Automatyczne prefiksy CSS
- **ESLint** - Linting (via TypeScript)

## 🚀 Instalacja i uruchomienie

### Wymagania wstępne

- Node.js 18+ 
- npm lub pnpm

### Instalacja zależności

```bash
npm install
# lub
pnpm install
```

### Dostępne komendy

```bash
# Uruchomienie serwera deweloperskiego
npm run dev

# Budowanie wersji produkcyjnej
npm run build

# Podgląd zbudowanej wersji
npm run preview

# Sprawdzenie typów TypeScript
npm run lint
```

### Uruchomienie lokalne

```bash
npm run dev
```

Strona będzie dostępna pod adresem `http://localhost:5173`

## 📁 Struktura projektu

```
Adamski.tech/
├── src/
│   ├── components/          # Komponenty React
│   │   └── RadarChart.tsx   # Wykres radarowy umiejętności
│   ├── routes/              # Routing i strony specjalne
│   │   ├── QRBiz.tsx       # Strona dla QR code z wizytówki
│   │   └── Hans.tsx        # Strona partnerska
│   ├── App.tsx             # Główny komponent aplikacji
│   ├── components.tsx      # Zbiorcze komponenty UI
│   ├── main.tsx            # Entry point
│   └── index.css           # Globalne style i Tailwind
├── content/
│   └── content.json        # Treści wielojęzyczne (3096 linii)
├── design/
│   ├── design.json         # Design tokens
│   ├── style.json          # Style system
│   └── mockups.md          # Mockupy projektowe
├── architecture/
│   └── ux_structure.md     # Dokumentacja architektury UX/UI
├── deployment/
│   └── deployment_plan.md  # Plan wdrożenia (Nginx/Netlify)
├── assets/
│   └── vcard/              # Pliki vCard
├── public/                 # Pliki statyczne
├── index.html              # HTML template
├── tailwind.config.js      # Konfiguracja Tailwind
├── tsconfig.json           # Konfiguracja TypeScript
├── postcss.config.js       # Konfiguracja PostCSS
└── package.json            # Zależności projektu
```

## 🎯 Sekcje strony

Strona składa się z następujących sekcji:

1. **Hero** - Nagłówek z głównym przekazem i CTA
2. **About** - Informacje o doświadczeniu i podejściu
3. **Career Timeline** - Oś czasu kariery zawodowej
4. **Skills** - Interaktywny wykaz kompetencji z wykresem radarowym
5. **Projects** - Portfolio zrealizowanych projektów
6. **AI Methodology** - Metodologia pracy z AI i automatyzacją
7. **Equipment Inventory** - Sprzęt i narzędzia
8. **Daremon Brand** - Filozofia i usługi marki
9. **Partners** - Karty partnerskie
10. **Contact** - Formularz kontaktowy i dane

## 🌍 Internacjonalizacja (i18n)

Projekt obsługuje trzy języki:
- 🇵🇱 Polski (PL) - domyślny
- 🇬🇧 Angielski (EN)
- 🇳🇱 Holenderski (NL)

Treści są zarządzane przez `content/content.json`, a wybór języka jest zapisywany w localStorage. System automatycznie wykrywa język przeglądarki przy pierwszym wejściu.

## 🎨 System designu

### Paleta kolorów
- **Tło przemysłowe**: `#0D1117` (rich black CMYK)
- **Akcent techniczny**: `#00BFFF` (LED blue)
- **Tekst jasny**: `#EAEAEA`

### Typografia
- **Inter** - Nagłówki i elementy UI
- **JetBrains Mono** - Detale techniczne i kod

### Design tokens
Design system jest w pełni konfigurowalny przez `design/design.json` i mapowany na Tailwind CSS przez `tailwind.config.js`.

## ♿ Dostępność

Projekt implementuje najlepsze praktyki dostępności:

- Semantyczny HTML5 (header, nav, main, section, article, footer)
- Skip link do głównej treści
- ARIA labels i role
- Hierarchia nagłówków (H1-H4)
- Kontrast min 4.5:1 (WCAG AA)
- Pełna obsługa klawiatury
- Focus indicators
- Support dla `prefers-reduced-motion`
- Screen reader friendly

## 📱 Responsywność

Mobile-first design z breakpointami:
- Mobile: ≤640px
- Tablet: 641-1024px
- Desktop: ≥1025px

## 🚀 Deployment

### Netlify (Zalecane)
```bash
# Build command
npm run build

# Publish directory
dist
```

Plik `public/_redirects` obsługuje routing SPA i custom redirects dla `/qr/biz` oraz `/hans`.

### Nginx
Szczegółowy plan wdrożenia znajduje się w `deployment/deployment_plan.md`, zawierający:
- Konfigurację HTTPS (Let's Encrypt)
- Cache statycznych plików
- SPA fallback
- Custom redirects
- Gzip compression

## 📄 Dokumentacja dodatkowa

- **Architecture**: `architecture/ux_structure.md` - Pełna struktura UX/UI
- **Style Guide**: `style_guide_adamski.md` - Wytyczne stylizacji (inkl. wersje drukowane)
- **Design**: `design/mockups.md` - Mockupy i specyfikacje
- **Deployment**: `deployment/deployment_plan.md` - Plan wdrożenia
- **Todo**: `todo.md` - Plan MVP

## 🔐 Zmienne środowiskowe

```env
VITE_CONTACT_EMAIL=twoj@email.com
```

Opcjonalna zmienna do nadpisania domyślnego adresu email kontaktowego.

## 🤝 Kontakt

- **Website**: https://adamski.tech
- **Email**: contact@adamski.tech
- **LinkedIn**: [Link w content.json]

## 📝 Licencja

Projekt prywatny - Dariusz Adamski © 2024

## 🔧 Development notes

### Pre-commit checklist
- [ ] TypeScript compilation passes (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Test on mobile viewport
- [ ] Verify all languages (PL/EN/NL)
- [ ] Check accessibility (keyboard navigation)

### Known issues
- 2 moderate severity npm audit warnings (sprawdź `npm audit`)
- React Router "use client" directive warnings (nie wpływają na działanie)

---

**Zaprojektowano w duchu industrial futurism** 🔧⚡