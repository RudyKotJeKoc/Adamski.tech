# Deprecated Components

**Data utworzenia:** 2025-11-18
**Cel:** Zachowanie wartościowych komponentów, które nie są obecnie używane w aktywnej wersji strony

---

## 📦 Dlaczego ten katalog istnieje?

Komponenty w `_deprecated/` to **ukończone, działające komponenty**, które:

- ✅ Nie są obecnie używane w produkcyjnej wersji strony
- ✅ Zawierają wartościową logikę/algorytmy dla przyszłego użytku
- ✅ Mogą być przywrócone gdy będzie potrzeba rozbudowy funkcjonalności
- ✅ Służą jako referencyjna implementacja wzorców UX/UI

**Nie są to "broken drafts" ani "szkice"** - to gotowe komponenty zachowane intencjonalnie.

---

## 📄 Zawartość katalogu

### `InteractiveSkillTag.tsx`

**Data dodania:** 2025-11-18
**Status:** ✅ Gotowy komponent (ocena: 7.5/10)
**Autor:** Original adamski.tech codebase

#### 🎯 Cel komponentu

Zaawansowany tag umiejętności z mikro-interakcjami do użycia w filtrze projektów lub prezentacji skills.

#### 🔧 Funkcjonalności

1. **Hover tooltips** - pokazują liczbę projektów ("3 projekty") lub poziom biegłości ("Ekspert")
2. **Proficiency levels** - 4 poziomy z color-coding:
   - `beginner` → zielony
   - `intermediate` → niebieski
   - `advanced` → fioletowy
   - `expert` → LED cyan (accent-led)
3. **Project count badge** - okrągły badge z animacją scale na hover
4. **Pulse animations** - border pulse effect przy interakcji
5. **Smart tooltip positioning** - dynamiczne top/bottom zależnie od viewport
6. **Proficiency indicator dot** - kolorowa kropka z pulse
7. **Click handler** - opcjonalny callback dla filtrowania

#### ⚠️ Wymaga poprawek przed użyciem

1. **i18n (internationalization)**
   ```tsx
   // OBECNIE (hardcoded Polish, linia 72-74):
   `${projectCount} projekt${projectCount === 1 ? '' : projectCount < 5 ? 'y' : 'ów'}`

   // POWINNO BYĆ:
   // Dodać prop: locale: Locale
   // Użyć localized pluralization
   ```

2. **CSS animations verification**
   ```tsx
   // Linie 172-189 - komentarz z animacjami:
   // Sprawdzić czy @keyframes są w index.css:
   // - ping, fade-in, slide-in-from-bottom-1
   ```

3. **Testing na mobile devices**
   - Tooltip positioning na małych ekranach
   - Touch interactions (hover state)

#### 💡 Kiedy użyć?

Rozważ przywrócenie tego komponentu gdy:

- ✅ Chcesz ulepszyć UX filtrowania projektów
- ✅ Potrzebujesz visual feedback dla proficiency levels
- ✅ Chcesz dodać "licznik projektów" dla każdego skilla
- ✅ Projektujesz sekcję Skills z advanced interactions

#### 📖 Przykład użycia

```tsx
import { InteractiveSkillTag } from './_deprecated/InteractiveSkillTag';

// W sekcji Projects (filtr):
<InteractiveSkillTag
  label="TypeScript"
  projectCount={5}
  proficiencyLevel="expert"
  onClick={() => setSelectedSkill('TypeScript')}
/>

// W sekcji Skills (display):
<InteractiveSkillTag
  label="React"
  proficiencyLevel="advanced"
/>
```

#### 🔄 Przed przywróceniem do aktywnego kodu:

1. [ ] Dodać `locale: Locale` prop
2. [ ] Zamienić hardcoded Polish text na i18n
3. [ ] Zweryfikować CSS animations (index.css lub tailwind.config)
4. [ ] Przetestować na mobile (touch interactions)
5. [ ] Code review dla consistency z obecnym design system
6. [ ] Przesunąć z `_deprecated/` do `components/`
7. [ ] Dodać eksport w `components.tsx`

---

## 🚫 Co NIE powinno być w tym katalogu

- ❌ Broken/incomplete code
- ❌ Experimental sketches
- ❌ Components z znanymi bugami
- ❌ Code bez wartości dla przyszłości

Jeśli komponent nie ma wartości - usuń go całkowicie (Git history zachowa).

---

## 📚 Dodatkowe referencje

**Dlaczego zachowane:**
- [UNUSED_COMPONENTS_ANALYSIS.md](../../UNUSED_COMPONENTS_ANALYSIS.md) - szczegółowa analiza wartości
- [CODE_QUALITY_AUDIT_REPORT.md](../../CODE_QUALITY_AUDIT_REPORT.md) - główny raport audytu

**Decyzja właściciela projektu:** 2025-11-18
Opcja A: Zachować wartościową logikę w `_deprecated/` dla przyszłego użytku.

---

## 🤝 Kontakt

Jeśli masz pytania o któryś z komponentów w tym katalogu:
1. Sprawdź sekcję "Wymaga poprawek" powyżej
2. Zobacz przykład użycia
3. Przejrzyj linked analysis docs

**Ostatnia aktualizacja:** 2025-11-18
