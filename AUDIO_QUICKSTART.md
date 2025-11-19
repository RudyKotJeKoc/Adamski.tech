# 🚀 Quick Start - Dodawanie Audio/Video

Szybki przewodnik jak dodać pliki audio do swojej strony w 3 krokach.

## Krok 1️⃣: Przygotuj plik audio

Nagraj lub przygotuj plik `.mp3` (zalecane 128-192 kbps, maks. 5 MB).

**Przykładowe nazwy:**
- `introduction.mp3` - wprowadzenie do sekcji O mnie
- `skills-overview.mp3` - przegląd umiejętności
- `machine-transfer-system.mp3` - opis projektu

## Krok 2️⃣: Umieść plik w odpowiednim folderze

Skopiuj plik do jednego z folderów:

```
/public/assets/audio/
├── about/          ← Sekcja "O mnie"
├── skills/         ← Sekcja "Umiejętności"
├── projects/       ← Sekcja "Projekty"
├── career/         ← Sekcja "Timeline kariery"
├── equipment/      ← Sekcja "Wyposażenie"
└── brand/          ← Sekcja "Filozofia Daremon"
```

**Przykład:**
```bash
# Dla sekcji Skills
cp moj-plik.mp3 public/assets/audio/skills/skills-overview.mp3
```

## Krok 3️⃣: Dodaj ścieżkę do content.json

Edytuj plik `/content/content.json`:

### Dla całej sekcji:

```json
{
  "pl": {
    "skills": {
      "title": "Kompetencje Techniczne",
      "audio": "/assets/audio/skills/skills-overview.mp3",
      ...
    }
  }
}
```

### Dla pojedynczego projektu:

```json
{
  "pl": {
    "projects": {
      "items": [
        {
          "name": "Machine Transfer System",
          "audio": "/assets/audio/projects/machine-transfer-system.mp3",
          ...
        }
      ]
    }
  }
}
```

## ✅ Gotowe!

Uruchom projekt lokalnie i sprawdź:

```bash
npm run dev
```

Odtwarzacz audio pojawi się automatycznie w sekcji, do której dodałeś plik.

---

## 📚 Więcej informacji

Pełny przewodnik: [AUDIO_GUIDE.md](./AUDIO_GUIDE.md)

Szczegółowe wskazówki dla każdej sekcji: `/public/assets/audio/[sekcja]/README.md`
