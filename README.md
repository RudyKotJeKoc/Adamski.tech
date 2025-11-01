# Adamski.tech — Daremon Engineering

Profesjonalna strona wizytówka inżyniera automatyki i utrzymania ruchu. Interaktywna, responsywna aplikacja SPA (Single Page Application) zbudowana w React z TypeScript, stylizowana Tailwind CSS.

## 🎯 O projekcie

Adamski.tech to nowoczesna strona prezentująca doświadczenie i kompetencje w obszarach:
- **Automatyka przemysłowa** — PLC, robotyka, retrofity systemów
- **Utrzymanie ruchu (MIM)** — zarządzanie przestojami, TPM, diagnostyka
- **IoT i Industry 4.0** — integracja systemów, monitoring, smart manufacturing
- **Projekty techniczne** — CAD, druk 3D, prototypowanie
- **Full-stack development** — aplikacje webowe wspierające procesy produkcyjne

### ✨ Funkcjonalności

- 🌍 **Wielojęzyczność** — Polski (PL), angielski (EN), holenderski (NL)
- 🎨 **Dark mode** — Przemysłowy design inspirowany Tesla/GitHub
- 📱 **Responsive** — Mobile-first, optymalizacja dla wszystkich urządzeń
- ♿ **Dostępność** — Semantic HTML, ARIA labels, keyboard navigation
- 🚀 **Animacje** — Smooth scroll, reveal effects, interactive components
- 📊 **Interaktywne sekcje**:
  - Timeline kariery z kluczowymi projektami
  - Radar chart umiejętności technicznych
  - Portfolio projektów z filtrowaniem
  - Szczegóły wyposażenia warsztatu/laboratorium
  - Integracje z AI workflow (GitHub Copilot, Claude, Cursor)

## 🛠️ Stack technologiczny

### Frontend
- **React 18** — Biblioteka UI z Hooks
- **TypeScript 5.6** — Typowanie statyczne
- **Vite 5** — Build tool (ESM, HMR)
- **React Router 7** — Routing SPA
- **Tailwind CSS 3.4** — Utility-first CSS framework
- **PostCSS** — CSS processing

### Design System
- **Fonty**: Inter (UI), JetBrains Mono (kod/detale techniczne)
- **Paleta**: Custom industrial dark theme (design.json)
- **Komponenty**: Modularny system z components.tsx
- **Animacje**: Custom reveal utilities, smooth transitions

### Content Management
- `content/content.json` — Wszystkie teksty (PL/EN/NL)
- `design/design.json` — Design tokens (kolory, fonty, cienie)
- `design/style.json` — Dodatkowe style i komponenty

### Infrastruktura
- **Hosting**: Netlify / Nginx (patrz: deployment/deployment_plan.md)
- **CI/CD**: Automatyczne buildy i deploymenty
- **Analytics**: Plausible/Umami (opcjonalnie)

## 📦 Struktura projektu

```
.
├── src/
│   ├── App.tsx              # Główna aplikacja, sekcje, locale context
│   ├── components.tsx       # Wszystkie komponenty UI
│   ├── main.tsx            # Entry point React
│   └── index.css           # Tailwind directives + utilities
├── content/
│   └── content.json        # Treści w PL/EN/NL
├── design/
│   ├── design.json         # Design tokens
│   └── style.json          # Extended styles
├── public/
│   ├── vcard.vcf           # vCard do pobrania
│   ├── dariusz-adamski-cv.pdf  # CV
│   └── _redirects          # Netlify redirects
├── prepress/               # Pliki wizytówek (SVG)
├── architecture/           # Dokumentacja UX/struktury
├── deployment/             # Plan wdrożenia (Nginx/Netlify)
├── qa/                     # Quality assurance docs
└── index.html              # HTML entry point
```

## 🚀 Instalacja i uruchomienie

### Wymagania
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (lub pnpm/yarn)

### Lokalny development

```bash
# Klonowanie repozytorium
git clone https://github.com/RudyKotJeKoc/Adamski.tech.git
cd Adamski.tech

# Instalacja zależności
npm install

# Uruchomienie dev servera (HMR)
npm run dev
# Aplikacja dostępna na http://localhost:5173

# Typecheck (bez kompilacji)
npm run lint

# Build produkcyjny
npm run build

# Podgląd buildu
npm run preview
```

## 🌐 Deployment

### Netlify (zalecane)
1. Skonfiguruj build command: `npm run build`
2. Publish directory: `dist`
3. Dodaj `public/_redirects` dla SPA routing
4. Ustaw zmienne środowiskowe (jeśli potrzebne)

### Nginx (własny serwer)
Szczegóły w `deployment/deployment_plan.md`:
- SSL certyfikaty (Let's Encrypt)
- Gzip compression
- Static files caching
- SPA fallback (`try_files`)
- Custom redirects dla QR codes

## 📄 Dodatkowe dokumenty

- **UX/UI Structure**: `architecture/ux_structure.md`
- **Style Guide**: `style_guide_adamski.md`
- **Deployment Plan**: `deployment/deployment_plan.md`
- **QA Checklist**: `qa/qa_card_and_web.md`
- **Prepress Specs**: `prepress/spec.md`
- **Design Mockups**: `design/mockups.md`

## 🎨 Design & Branding

Projekt wykorzystuje filozofię **Daremon Engineering**:
- Precyzja techniczna bez marketingowego szumu
- Przemysłowy minimalizm (industrial futurism)
- Czytelność i funkcjonalność > ozdobniki
- Spójność z materiałami drukowanymi (wizytówki, NFC)

Kolory:
- Background: `#0b0f14` (dark industrial)
- Accent: `#3b82f6` (tech blue), `#38bdf8` (LED glow)
- Surface: `#141a22` (elevated cards)

## 📞 Kontakt

**Dariusz Adamski — Daremon Engineering**
- 🌐 Website: [adamski.tech](https://adamski.tech)
- 📧 Email: kontakt@adamski.tech
- 📱 vCard: [Pobierz kontakt](https://adamski.tech/vcard.vcf)

## 📝 Licencja

© 2024 Dariusz Adamski — Daremon Engineering. Wszystkie prawa zastrzeżone.

Kod źródłowy aplikacji jest własnością autora. Treści, design i branding chronione prawem autorskim.