# 🎵 Przewodnik Audio/Video dla Adamski.tech

Ten dokument opisuje jak dodać pliki audio i video do Twojej strony portfolio.

## 📋 Spis treści

1. [Struktura folderów](#struktura-folderów)
2. [Obsługiwane formaty](#obsługiwane-formaty)
3. [Jak dodać audio do sekcji](#jak-dodać-audio-do-sekcji)
4. [Konwencja nazewnictwa](#konwencja-nazewnictwa)
5. [Przykłady integracji](#przykłady-integracji)
6. [Zalecenia techniczne](#zalecenia-techniczne)

## 📁 Struktura folderów

Wszystkie pliki audio/video znajdują się w katalogu `/public/assets/audio/`:

```
/public/assets/audio/
├── README.md           # Ten plik
├── about/             # Audio dla sekcji "O mnie"
│   └── README.md      # Szczegółowe wskazówki
├── skills/            # Audio dla sekcji "Umiejętności"
│   └── README.md
├── projects/          # Audio dla sekcji "Projekty"
│   └── README.md
├── career/            # Audio dla sekcji "Timeline kariery"
│   └── README.md
├── equipment/         # Audio dla sekcji "Wyposażenie"
│   └── README.md
└── brand/             # Audio dla sekcji "Filozofia Daremon"
    └── README.md
```

## 🎧 Obsługiwane formaty

### Audio:
- **.mp3** (zalecane) - najlepsza kompatybilność
- **.wav** - wysoka jakość, duże pliki
- **.ogg** - dobra kompresja

### Video:
- **.mp4** (zalecane) - uniwersalny format
- **.webm** - dobra kompresja, nowoczesne przeglądarki

## 🚀 Jak dodać audio do sekcji

### Krok 1: Przygotuj plik audio

1. Nagraj lub przygotuj plik audio w jednym z obsługiwanych formatów
2. Nazwij plik zgodnie z konwencją (patrz niżej)
3. Zoptymalizuj rozmiar pliku (zalecane: MP3 128-192 kbps)

### Krok 2: Umieść plik w odpowiednim katalogu

Skopiuj plik do odpowiedniego folderu w `/public/assets/audio/`:

```bash
# Przykład dla sekcji Skills
cp moj-plik.mp3 /public/assets/audio/skills/skills-overview.mp3

# Przykład dla projektu
cp opis-projektu.mp3 /public/assets/audio/projects/machine-transfer-system.mp3
```

### Krok 3: Dodaj ścieżkę do content.json

Edytuj plik `/content/content.json` i dodaj pole `"audio"`:

#### Dla całej sekcji:

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

#### Dla pojedynczego projektu:

```json
{
  "pl": {
    "projects": {
      "title": "Projekty",
      "items": [
        {
          "name": "Machine Transfer System",
          "tagline": "Retrofit systemu transportu międzymaszynowego",
          "audio": "/assets/audio/projects/machine-transfer-system.mp3",
          ...
        }
      ]
    }
  }
}
```

## 📝 Konwencja nazewnictwa

Używaj formatu **kebab-case** (małe litery, słowa oddzielone myślnikiem):

### ✅ Poprawne nazwy:
- `skills-overview.mp3`
- `introduction.mp3`
- `machine-transfer-system.mp3`
- `career-2020-present.mp3`
- `automation-expertise.mp3`

### ❌ Niepoprawne nazwy:
- `SkillsOverview.mp3` (CamelCase)
- `skills overview.mp3` (spacje)
- `skills_overview.mp3` (snake_case dozwolone, ale niezalecane)
- `umiejętności.mp3` (znaki specjalne)

## 💡 Przykłady integracji

### 1. Sekcja "O mnie" (About)

**Plik:** `/public/assets/audio/about/introduction.mp3`

**Zawartość audio:** Krótkie 60-sekundowe wprowadzenie, kim jesteś i czym się zajmujesz.

**W content.json:**
```json
"about": {
  "title": "O mnie",
  "audio": "/assets/audio/about/introduction.mp3",
  "cards": [...]
}
```

### 2. Sekcja "Umiejętności" (Skills)

**Plik:** `/public/assets/audio/skills/skills-overview.mp3`

**Zawartość audio:** Przegląd Twoich kompetencji technicznych (90 sekund).

**W content.json:**
```json
"skills": {
  "title": "Kompetencje Techniczne",
  "audio": "/assets/audio/skills/skills-overview.mp3",
  "categories": [...]
}
```

### 3. Pojedynczy projekt

**Plik:** `/public/assets/audio/projects/machine-transfer-system.mp3`

**Zawartość audio:** Szczegółowy opis projektu: wyzwanie, podejście, rezultaty (2-3 minuty).

**W content.json:**
```json
{
  "name": "Machine Transfer System",
  "tagline": "Retrofit systemu transportu międzymaszynowego",
  "audio": "/assets/audio/projects/machine-transfer-system.mp3",
  "summary": "...",
  "challenge": "...",
  ...
}
```

## 🎯 Zalecenia techniczne

### Jakość audio:
- **Format:** MP3
- **Bitrate:** 128-192 kbps (balans jakość/rozmiar)
- **Częstotliwość próbkowania:** 44.1 kHz
- **Kanały:** Mono (dla mowy) lub Stereo (dla muzyki)

### Długość nagrań:
- **Wprowadzenia sekcji:** 30-90 sekund
- **Opisy projektów:** 2-5 minut
- **Szczegółowe opisy:** 3-7 minut

### Rozmiar plików:
- Staraj się utrzymać poniżej **5 MB na plik**
- Dla dłuższych nagrań (>5 min) rozważ kompresję do 96-128 kbps

### Przygotowanie nagrania:
1. **Nagraj w cichym miejscu** - minimalizuj szumy tła
2. **Używaj dobrego mikrofonu** - jakość ma znaczenie
3. **Mów wyraźnie i w spokojnym tempie**
4. **Edytuj nagranie:**
   - Usuń długie przerwy i "yyy", "eee"
   - Dodaj fade-in i fade-out na początku i końcu
   - Normalizuj głośność

### Narzędzia do edycji (bezpłatne):
- **Audacity** - edytor audio dla Windows/Mac/Linux
- **GarageBand** - dla użytkowników Mac
- **Ocenaudio** - prosty edytor audio

## 🔧 Jak konwertować pliki do MP3

### Używając ffmpeg (wiersz poleceń):

```bash
# Konwersja WAV do MP3
ffmpeg -i input.wav -codec:a libmp3lame -b:a 192k output.mp3

# Konwersja z normalizacją głośności
ffmpeg -i input.wav -af "loudnorm" -b:a 192k output.mp3

# Konwersja do mono (mniejszy rozmiar)
ffmpeg -i input.wav -ac 1 -b:a 128k output.mp3
```

### Używając narzędzi online:
- **CloudConvert** - https://cloudconvert.com/
- **Online Audio Converter** - https://online-audio-converter.com/

## 📊 Przykładowa struktura treści audio

### Dla wprowadzenia do sekcji (60-90 sekund):
1. **0-10s:** Przywitanie i nazwa sekcji
2. **10-50s:** Główna treść - kluczowe informacje
3. **50-60s:** Podsumowanie i zachęta do zapoznania się z detalami

### Dla opisu projektu (2-3 minuty):
1. **0-20s:** Nazwa projektu i kontekst
2. **20-80s:** Wyzwanie - jaki problem rozwiązywałeś
3. **80-140s:** Podejście - jak go rozwiązałeś (technologie, metody)
4. **140-160s:** Rezultaty - co osiągnąłeś (metryki, efekty)
5. **160-180s:** Podsumowanie i wnioski

## 🎬 Video zamiast audio

Możesz również dodać video! Komponent AudioPlayer obsługuje oba formaty.

**Przykład:**
```json
{
  "name": "Smart Home Infrastructure",
  "audio": "/assets/audio/projects/smart-home-demo.mp4",
  ...
}
```

Komponent automatycznie wykryje, że to video i wyświetli odtwarzacz z obrazem.

## 🤔 FAQ

**Q: Czy muszę dodać audio do każdej sekcji?**
A: Nie! Audio jest opcjonalne. Dodaj je tylko tam, gdzie uznajesz, że wartość dla użytkownika jest wysoka.

**Q: Czy mogę użyć muzyki w tle?**
A: Tak, ale upewnij się, że masz prawa do używania muzyki. Najlepiej użyj royalty-free music lub nagrań bez muzyki.

**Q: Co jeśli plik audio jest za duży?**
A: Zmniejsz bitrate (np. do 96 kbps dla mowy), skróć nagranie lub rozważ podzielenie na mniejsze części.

**Q: Czy audio działa na urządzeniach mobilnych?**
A: Tak! Komponent AudioPlayer jest w pełni responsywny i działa na wszystkich urządzeniach.

**Q: Jak przetestować, czy audio działa?**
A: Uruchom lokalnie projekt (`npm run dev`) i sprawdź, czy player się pojawia i czy plik się odtwarza.

## 📞 Potrzebujesz pomocy?

Jeśli masz pytania lub problemy z dodawaniem audio/video:

1. Sprawdź README w odpowiednim folderze (`/public/assets/audio/[sekcja]/README.md`)
2. Upewnij się, że ścieżka do pliku w `content.json` jest poprawna
3. Sprawdź konsolę przeglądarki pod kątem błędów

---

**Powodzenia z dodawaniem audio do portfolio! 🎉**
