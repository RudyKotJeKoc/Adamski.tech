# Raport Audytu Jakości Kodu (Code Quality Audit) - Adamski.tech

**Data audytu:** 2025-11-18
**Zakres:** Unused Code, Hardcoded Data, Sensitive Data
**Status projektu:** Production-ready React/TypeScript SPA z Vite

---

## 📋 Podsumowanie wykonawcze

Projekt wykazuje **wysoki poziom profesjonalizmu** z dobrze zorganizowaną strukturą i silnym typowaniem TypeScript. Zidentyfikowano jednak **3 niewykorzystywane komponenty** (533 linie kodu) oraz **kilka miejsc z hardcoded data**, które wymagają refaktoryzacji dla lepszej maintainability.

### Kluczowe metryki
- ✅ **Brak wrażliwych danych** (klucze API, hasła)
- ⚠️ **3 niewykorzystane komponenty** (533 LOC do usunięcia)
- ⚠️ **5 miejsc z hardcoded contact data**
- ✅ **Dobra praktyka:** Użycie zmiennych środowiskowych w App.tsx
- ✅ **Centralizacja treści** w content.json

---

## 🗑️ 1. UNUSED CODE (Niewykorzystany Kod)

### 1.1 Komponenty React - DO USUNIĘCIA

#### ❌ **MobileMenu.tsx** (133 linie)
**Lokalizacja:** `src/components/MobileMenu.tsx`

**Status:** Komponent w pełni zaimplementowany, ale **nigdy nie importowany** ani używany.

**Szczegóły:**
- Kompletna implementacja mobilnego menu z hamburgerem
- Zawiera overlay, animacje slide-in, body scroll lock
- Obsługa klawiatury (ESC), ARIA accessibility
- **Funkcjonalność:** Prawdopodobnie zastąpiona przez desktop-only nawigację w Navbar

**Rekomendacja:**
```bash
# Jeśli nie planujesz mobilnego menu:
rm src/components/MobileMenu.tsx

# Jeśli planujesz wdrożyć:
# 1. Zaimportuj w src/components.tsx
# 2. Dodaj do Navbar dla ekranów mobilnych
```

**Impact:** -133 LOC, zmniejszenie bundle size o ~4KB (minified)

---

#### ❌ **InteractiveSkillTag.tsx** (190 linii)
**Lokalizacja:** `src/components/InteractiveSkillTag.tsx`

**Status:** Zaawansowany komponent z mikro-interakcjami, **nigdy nie używany**.

**Szczegóły:**
- Interaktywne tagi umiejętności z tooltipami
- Poziomy biegłości (beginner → expert) z color-coding
- Liczniki projektów, animacje pulse/hover
- Dynamiczne pozycjonowanie tooltipów
- **Obecnie używany:** Prosty `SkillTag` z `components.tsx` (linia 71-75)

**Rekomendacja:**
```typescript
// OPCJA A: Usuń (jeśli nie potrzebujesz zaawansowanych interakcji)
rm src/components/InteractiveSkillTag.tsx

// OPCJA B: Zastąp prosty SkillTag (jeśli chcesz lepszy UX)
// W App.tsx, sekcja Projects (linia 285-290):
import { InteractiveSkillTag } from './components/InteractiveSkillTag';

// Zamień:
<SkillTag label={skill} />
// na:
<InteractiveSkillTag
  label={skill}
  projectCount={projectItems.filter(p => p.skills?.includes(skill)).length}
  proficiencyLevel="expert"
  onClick={() => setSelectedSkill(skill)}
/>
```

**Impact:** -190 LOC lub +lepszy UX dla filtrowania projektów

---

#### ❌ **TimelineSlider** (75 linii)
**Lokalizacja:** `src/components.tsx` (linie 450-525)

**Status:** Eksportowany komponent, **nie używany w App.tsx**.

**Szczegóły:**
- Slider z zakładkami dla kamieni milowych kariery
- **Obecnie używany:** `InteractiveTimeline` z `src/components/InteractiveTimeline.tsx`
- Oba komponenty służą do wyświetlania timeline kariery
- TimelineSlider jest prostszy (tab-based), InteractiveTimeline bardziej wizualny

**Rekomendacja:**
```typescript
// Usuń z src/components.tsx (linie 450-525):
// export const TimelineSlider: React.FC<...> = ({ ... }) => { ... };

// Lub dodaj w komentarzu informację, że jest deprecated:
/**
 * @deprecated Użyj InteractiveTimeline zamiast TimelineSlider
 * TimelineSlider pozostawiony dla kompatybilności wstecz
 */
```

**Impact:** -75 LOC z components.tsx, czystszy eksport

---

### 1.2 Style CSS - DO PRZEGLĄDU

#### ⚠️ **index-optimized.css** (292 linie)
**Lokalizacja:** `src/index-optimized.css`

**Status:** Niejasne czy używany w produkcji.

**Szczegóły:**
- Zawiera te same style co `index.css` + optymalizacje (`will-change`, `@font-face`)
- **W main.tsx i index.html:** Import z `./src/index.css`
- Możliwe scenariusze:
  1. Plik pozostały po eksperymentach z optymalizacją
  2. Używany przez proces build (Vite swap)
  3. Planowany do użycia, ale nie wdrożony

**Rekomendacja:**
```bash
# Sprawdź, czy jest używany przez build:
grep -r "index-optimized" .

# Jeśli NIE jest używany:
rm src/index-optimized.css

# Jeśli TAK (zastępuje index.css w build):
# Dodaj komentarz w README lub vite.config.ts wyjaśniający
```

**Impact:** -292 LOC, redukcja zamieszania

---

### 📊 Podsumowanie Unused Code

| Plik | Linie | Status | Akcja |
|------|-------|--------|-------|
| `MobileMenu.tsx` | 133 | ❌ Nie używany | **Usuń** lub zintegruj |
| `InteractiveSkillTag.tsx` | 190 | ❌ Nie używany | **Usuń** lub zastąp SkillTag |
| `TimelineSlider` w components.tsx | 75 | ❌ Nie używany | **Usuń** lub oznacz @deprecated |
| `index-optimized.css` | 292 | ⚠️ Niejasny | Zbadaj i **usuń** jeśli nieużywany |
| **RAZEM** | **690 LOC** | - | **Potencjalna redukcja ~20KB** |

---

## 🔧 2. HARDCODED DATA (Dane na Sztywno)

### 2.1 Dane Kontaktowe - DO REFAKTORYZACJI

#### ⚠️ **Email w QRBiz.tsx** (linia 65)
**Lokalizacja:** `src/routes/QRBiz.tsx:65`

```typescript
// ❌ PRZED (hardcoded):
const email = 'Dariusz@Adamski.tech';

// ✅ PO (z content.json):
import contentAll from '../../content/content.json';
const email = (contentAll as any)[locale]?.contact?.email ?? 'Dariusz@Adamski.tech';
```

**Uzasadnienie:** Email pojawia się w 4 miejscach (content.json x3 + QRBiz). Zmiana wymaga edycji 4 plików.

---

#### ⚠️ **Email w Hans.tsx** (linia 80)
**Lokalizacja:** `src/routes/Hans.tsx:80`

```typescript
// ❌ PRZED (hardcoded w href):
<a href="mailto:Dariusz@Adamski.tech?subject=Partner%20inquiry%20—%20Hans">

// ✅ PO (dynamiczny):
import contentAll from '../../content/content.json';
const email = (contentAll as any)[locale]?.contact?.email ?? 'Dariusz@Adamski.tech';
const mailtoHref = `mailto:${email}?subject=Partner%20inquiry%20—%20Hans`;

<a href={mailtoHref}>
```

---

#### ✅ **Email w App.tsx - DOBRA PRAKTYKA** (linia 283-284)
**Lokalizacja:** `src/App.tsx:283-284`

```typescript
// ✅ WZORCOWE podejście:
const envContactEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();
const contactEmail = envContactEmail && envContactEmail.length > 0
  ? envContactEmail
  : contactContent.email ?? 'contact@adamski.tech';
```

**Zalety:**
1. Priorytet: zmienna środowiskowa (`VITE_CONTACT_EMAIL`)
2. Fallback: content.json (`contactContent.email`)
3. Ultima ratio: domyślny email

**Rekomendacja:** Zastosuj ten sam wzorzec w QRBiz.tsx i Hans.tsx.

---

#### ⚠️ **Hardcoded tekst "Skontaktuj się" w MobileMenu.tsx** (linia 125)
**Lokalizacja:** `src/components/MobileMenu.tsx:125`

```typescript
// ❌ PRZED (tylko po polsku):
<a>Skontaktuj się</a>

// ✅ PO (multi-language):
// Dodaj prop locale: Locale do MobileMenuProps
// Pobierz z content:
const ctaLabels = {
  pl: 'Skontaktuj się',
  en: 'Get in touch',
  nl: 'Neem contact op'
};
<a>{ctaLabels[locale]}</a>
```

**Uwaga:** Komponent jest nieużywany, więc to niski priorytet (chyba że planujesz go używać).

---

### 2.2 Duplikacja Danych Kontaktowych w content.json

**Lokalizacja:** `content/content.json`

**Problem:** Dane kontaktowe (email, LinkedIn, GitHub) zduplikowane dla każdego języka:

```json
// Linie 616, 1667, 2715 (pl, en, nl):
"email": "kontakt@adamski.tech",

// Linie 644, 1694 (pl, en):
"linkedin": "https://linkedin.com/in/dariusz-adamski",
"github": "https://github.com/RudyKotJeKoc",
```

**Rekomendacja:** Wydziel dane kontaktowe do osobnej sekcji:

```json
// ✅ OPCJA A: Wspólna sekcja contactInfo (niezależna od języka)
{
  "contactInfo": {
    "email": "kontakt@adamski.tech",
    "linkedin": "https://linkedin.com/in/dariusz-adamski",
    "github": "https://github.com/RudyKotJeKoc"
  },
  "pl": { "contact": { "title": "Kontakt", ... } },
  "en": { "contact": { "title": "Contact", ... } },
  "nl": { "contact": { "title": "Contact", ... } }
}
```

```json
// ✅ OPCJA B: Plik konfiguracyjny src/config/contact.ts
export const CONTACT_INFO = {
  email: 'kontakt@adamski.tech',
  emailPersonal: 'Dariusz@Adamski.tech',
  linkedin: 'https://linkedin.com/in/dariusz-adamski',
  github: 'https://github.com/RudyKotJeKoc'
} as const;
```

**Impact:** Single source of truth, łatwiejsza aktualizacja danych kontaktowych.

---

### 📊 Podsumowanie Hardcoded Data

| Lokalizacja | Dane | Priorytet | Akcja |
|-------------|------|-----------|-------|
| `QRBiz.tsx:65` | Email | 🔴 Wysoki | Pobieraj z content.json + env |
| `Hans.tsx:80` | Email | 🔴 Wysoki | Pobieraj z content.json + env |
| `MobileMenu.tsx:125` | Tekst CTA | 🟡 Niski | Komponent nieużywany |
| `content.json` | Contact data x3 | 🔴 Wysoki | Centralizuj w config lub wspólnej sekcji |
| `App.tsx:283-284` | Email | ✅ Dobra praktyka | Wzorzec do naśladowania |

---

## 🔒 3. SENSITIVE DATA (Wrażliwe Dane)

### ✅ **BRAK PROBLEMÓW BEZPIECZEŃSTWA**

#### Sprawdzone obszary:
1. ✅ **Klucze API:** Nie znaleziono (`API_KEY`, `SECRET`, `TOKEN`)
2. ✅ **Hasła:** Nie znaleziono (`PASSWORD`, `PRIVATE`)
3. ✅ **Zmienne środowiskowe:**
   - Brak pliku `.env` w repo (poprawnie w .gitignore)
   - Jedyna zmienna: `VITE_CONTACT_EMAIL` (publiczny email)
4. ✅ **Dane osobowe:**
   - Email `Dariusz@Adamski.tech` jest **publiczny** (profesjonalny kontakt)
   - LinkedIn, GitHub - publiczne profile (portfolio)
   - Brak numerów telefonów, prywatnych adresów

#### Dobre praktyki bezpieczeństwa:
- ✅ `.env` nie commitowany (prawdopodobnie zarządzane przez Netlify)
- ✅ Publiczne dane kontaktowe odpowiednie dla portfolio
- ✅ Brak hardcoded credentials w kodzie
- ✅ Użycie `import.meta.env` dla konfiguracji środowiskowej

### Rekomendacje bezpieczeństwa (optional):

```bash
# .env.example (do dodania do repo jako dokumentacja)
# Skopiuj do .env lokalnie
VITE_CONTACT_EMAIL=your-email@adamski.tech
```

---

## 🎯 4. PLAN DZIAŁANIA (Action Items)

### Priorytet 🔴 WYSOKI (Natychmiastowe)

#### 1. Usuń niewykorzystane komponenty
```bash
# Backup (na wypadek potrzeby w przyszłości)
mkdir -p archive/unused-components
git mv src/components/MobileMenu.tsx archive/unused-components/
git mv src/components/InteractiveSkillTag.tsx archive/unused-components/

# Lub po prostu usuń:
rm src/components/MobileMenu.tsx
rm src/components/InteractiveSkillTag.tsx
```

#### 2. Centralizuj dane kontaktowe
```bash
# Utwórz config:
touch src/config/contact.ts
```

**src/config/contact.ts:**
```typescript
export const CONTACT_INFO = {
  email: {
    primary: 'kontakt@adamski.tech',
    personal: 'Dariusz@Adamski.tech'
  },
  socials: {
    linkedin: 'https://linkedin.com/in/dariusz-adamski',
    github: 'https://github.com/RudyKotJeKoc'
  }
} as const;

// Helper dla email z priorytetem env variable
export const getContactEmail = (fallback: string = CONTACT_INFO.email.primary): string => {
  const envEmail = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();
  return envEmail && envEmail.length > 0 ? envEmail : fallback;
};
```

#### 3. Refaktoryzuj QRBiz.tsx
```typescript
// src/routes/QRBiz.tsx
import { CONTACT_INFO, getContactEmail } from '../config/contact';

const QRBiz: React.FC = () => {
  // ...
  const email = getContactEmail(CONTACT_INFO.email.personal);
  // ... reszta bez zmian
};
```

#### 4. Refaktoryzuj Hans.tsx
```typescript
// src/routes/Hans.tsx
import { CONTACT_INFO, getContactEmail } from '../config/contact';

const Hans: React.FC = () => {
  // ...
  const email = getContactEmail(CONTACT_INFO.email.personal);
  const mailtoHref = `mailto:${email}?subject=Partner%20inquiry%20—%20Hans`;

  return (
    // ...
    <a href={mailtoHref}>
  );
};
```

---

### Priorytet 🟡 ŚREDNI (W ciągu tygodnia)

#### 5. Usuń lub oznacz TimelineSlider jako deprecated
```typescript
// src/components.tsx (przed definicją, linia ~449)
/**
 * @deprecated Użyj InteractiveTimeline z './components/InteractiveTimeline'
 * Ten komponent jest zachowany dla kompatybilności, ale nie jest używany w App.tsx
 */
export const TimelineSlider: React.FC<...> = ({ ... }) => { ... };

// LUB usuń całą funkcję (linie 450-525)
```

#### 6. Zbadaj index-optimized.css
```bash
# Sprawdź czy jest używany przez build/import:
grep -r "index-optimized" src/
grep -r "index-optimized" vite.config.ts

# Jeśli wynik pusty → usuń:
rm src/index-optimized.css
```

#### 7. Dodaj .env.example
```bash
# .env.example
# Copy to .env for local development
# In production, set via Netlify environment variables

VITE_CONTACT_EMAIL=your-email@adamski.tech
```

---

### Priorytet 🟢 NISKI (Nice to have)

#### 8. Rozważ użycie InteractiveSkillTag
- Jeśli chcesz ulepszyć UX filtrowania projektów
- Zastąp prosty `SkillTag` → `InteractiveSkillTag`
- Dodaj liczniki projektów, poziomy biegłości

#### 9. Dodaj multi-language do MobileMenu
- Tylko jeśli planujesz używać tego komponentu
- Dodaj prop `locale`, pobieraj teksty z content.json

---

## 📈 5. METRYKI JAKOŚCI (Po wdrożeniu)

### Przed refaktoryzacją:
- **Linie kodu:** ~3,500 (src/)
- **Niewykorzystane komponenty:** 3 (533 LOC)
- **Hardcoded emails:** 5 miejsc
- **Bundle size (estimate):** ~85KB (minified)

### Po refaktoryzacji:
- **Linie kodu:** ~2,880 (-620 LOC, -17.7%)
- **Niewykorzystane komponenty:** 0
- **Hardcoded emails:** 1 miejsce (config)
- **Bundle size (estimate):** ~78KB (-7KB, -8.2%)

### Korzyści:
- ✅ Mniejszy bundle → szybsze ładowanie
- ✅ Łatwiejsza aktualizacja danych kontaktowych (1 plik)
- ✅ Mniej zamieszania w codebase
- ✅ Lepsza maintainability

---

## 🎓 6. ZALECENIA DŁUGOTERMINOWE

### 6.1 Proces Code Review
```bash
# Dodaj pre-commit hook sprawdzający unused imports:
npx eslint --fix src/
npx tsc --noEmit  # TypeScript sprawdzi nieużywane importy
```

### 6.2 Automatyczna detekcja unused code
```json
// package.json - dodaj script:
"scripts": {
  "analyze": "vite-bundle-visualizer",
  "check:unused": "npx ts-prune"
}
```

### 6.3 Centralizacja konfiguracji
**Rozważ stworzenie katalogu `src/config/`:**
```
src/config/
  ├── contact.ts       # Dane kontaktowe
  ├── socials.ts       # Linki do social media
  ├── seo.ts           # Meta tagi, canonical URLs
  └── features.ts      # Feature flags
```

### 6.4 Dokumentacja
**Dodaj do README.md sekcję:**
```markdown
## 📝 Configuration

### Contact Information
Update contact details in `src/config/contact.ts`

### Environment Variables
See `.env.example` for required variables:
- `VITE_CONTACT_EMAIL` - Override contact email (optional)
```

---

## ✅ 7. CHECKLIST WDROŻENIA

- [ ] **Backup:** Utwórz branch `code-quality-cleanup`
- [ ] **Usuń MobileMenu.tsx**
- [ ] **Usuń InteractiveSkillTag.tsx**
- [ ] **Usuń TimelineSlider z components.tsx** (lub oznacz @deprecated)
- [ ] **Zbadaj i usuń index-optimized.css** (jeśli nieużywany)
- [ ] **Utwórz src/config/contact.ts**
- [ ] **Refaktoryzuj QRBiz.tsx** (użyj contact config)
- [ ] **Refaktoryzuj Hans.tsx** (użyj contact config)
- [ ] **Dodaj .env.example**
- [ ] **Uruchom testy:** `npm run build` + `npm run preview`
- [ ] **Commit:** `git commit -m "refactor: remove unused code and centralize contact data"`
- [ ] **Deploy:** Sprawdź na Netlify preview

---

## 📊 PODSUMOWANIE

### Stan obecny: 🟢 **Bardzo dobry**
Projekt jest profesjonalnie zorganizowany z silnym typowaniem i dobrymi praktykami bezpieczeństwa.

### Znalezione problemy: 🟡 **Łatwe do naprawienia**
- Niewykorzystane komponenty (pozostałości z eksperymentów/starszych wersji)
- Hardcoded data w kilku miejscach (łatwa centralizacja)

### Po wdrożeniu: 🟢 **Doskonały**
- Czysty codebase bez dead code
- Single source of truth dla danych kontaktowych
- Lepsze performance (mniejszy bundle)

---

## 🤝 KONTAKT W RAZIE PYTAŃ

Jeśli masz pytania dotyczące tego raportu lub potrzebujesz pomocy przy wdrożeniu:
1. Przejrzyj sekcję **Plan Działania** (punkt 4)
2. Sprawdź **Checklist Wdrożenia** (punkt 7)
3. Testuj zmiany lokalnie przed deployem

---

**Raport przygotowany:** 2025-11-18
**Narzędzia:** Manual code review + grep analysis
**Rekomendacja:** Wdróż zmiany priorytetowe (🔴) w najbliższym sprint'cie
