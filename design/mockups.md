# Mockups kart wizytowych — warianty A/B (85 × 55 mm)

Wytyczne wspólne:
- Format: 85 × 55 mm (EU), spady 3 mm, margines bezpieczny 5 mm, narożniki R3.
- Profil kolorów: CMYK (FOGRA39 / ISO Coated v2). Tekst i QR: 100K (czarna jednoskładnikowa). Tło: czernie kontrolowane (np. K95).
- Typografia: Inter (nagłówki), JetBrains Mono (detale techniczne, hasła). Wagę: nagłówki 700, podtytuły 600, detale 500.
- Czytelność/WCAG AA: zachować wysoki kontrast (czarne tło – jasny tekst lub 100K na białym), minimalne rozmiary: 7.5–8.5 pt dla drobnych elementów.
- QR: min 22 mm, zalecane 24 mm; quiet zone ≥ 4 mm; kolor 100K. Mikro-CTA 2–4 słowa obok/poniżej QR.
- Batch ID: mała notacja (np. adamski_card_v1) umieszczona w obszarze spadu (niewidoczna po cięciu).

## Wariant A — Industrial Minimal (dla Hansa i B2B)

Front (tło czarne, akcent techniczny #00BFFF):
- Strefa top-lewa (safe): 
  - Linia 1 (Inter 14 pt, 700): „Dariusz Adamski”
  - Linia 2 (Inter 10 pt, 600): „Maintenance & Automation Engineer”
- Strefa dół-lewa (safe):
  - JetBrains Mono 8.5 pt: „Dariusz@Adamski.tech · adamski.tech · TODO: +31 6 83128848”
- Strefa dół-prawa (safe):
  - QR (24 mm) do vCard (statyczny, offline). Pod QR mikro-CTA (Mono 7.5 pt): „Zeskanuj i zapisz kontakt”
- Rozmieszczenie:
  - Marginesy: 5 mm do cięcia; utrzymać odstępy min. 2 mm między liniami detali.
- Akcenty:
  - Delikatne podkreślenie akcentem #00BFFF (np. cienka linia 0.8–1.2 mm pod nagłówkiem).
- Tył:
  - Centrum (duże): „DAREMON” (Inter 24–28 pt, 700) z spot UV.
  - Dół-centrum: „adamski.tech” (Inter 9–10 pt).
  - Obszar NFC: znacznik pod chip (bez nadruku lub z delikatnym piktogramem).

## Wariant B — Creative Tech (dla sieci/rekrutacji)

Front (ciemna baza + „ostry” akcent):
- Top-lewa:
  - Inter 13 pt, 700: „Dariusz Adamski — Maintenance & Automation Engineer”
- Dół-lewa:
  - JetBrains Mono 8.5 pt: „Dariusz@Adamski.tech · adamski.tech · TODO: +31 6 83128848”
- Dół-prawa:
  - QR (24 mm) → portfolio („/qr/biz” z UTM). Mikro-CTA: „Zobacz projekty (60 s)”
- Element „edge”:
  - Nietypowe nacięcie lub mikro-wycięcie przy QR (np. diagonalna kreska 1.2 mm w #00BFFF). Uwaga: skonsultować z drukarnią tolerancje i minimalną odległość od spadu (≥ 3 mm).
- Tył:
  - Hasło (Mono 9 pt): „PLC · Robotics · MIM · IoT · 3D”
  - Dół-centrum: dodatkowy QR → portfolio (opcjonalnie) z mikro-CTA: „Zobacz projekty (60 s)”
  - Obszar NFC: możliwość „edge cut” dla efektu (jeśli drukarnia potwierdzi wykonanie).

## Pozycjonowanie (przykładowe wartości w mm od krawędzi bezpiecznej)

Front:
- Nagłówek (top-lewa): X=5, Y=7; interlinia 4 mm.
- Podtytuł: X=5, Y=15.
- Detale kontaktowe (dół-lewa): X=5, Y=40.
- QR (dół-prawa): X=55, Y=36; rozmiar 24 mm; quiet zone 4 mm.
- Mikro-CTA pod QR: X=55, Y=61 (uwzględnij spad – tekst nie może przekroczyć safe).

Back:
- „DAREMON” (centrum): X=42.5, Y=25 (centrowanie), szerokość tekstru – zachować margines safe.
- „adamski.tech” (dół-centrum): X=42.5, Y=48.
- NFC: znacznik techniczny bez nadruku w miejscu chipu; nie kolidować z spot UV.

## Prepress i jakość

- Pliki: PDF/X-4, fonty osadzone, tekst czarny 100K, biel = „papier”, QR 100%K (bez bogatej czerni na drobnicy).
- Spady: 3 mm; safe: 5 mm. Overprint: czarny tekst może mieć overprint; unikać nadmiernego „rich black” na drobnym tekście.
- Densitometria: kontrola gęstości K dla czytelności; unikać zbyt niskiej K na tle.
- Test wydruku próbnego: upewnić się, że QR skanuje się z odległości 30–40 cm; mikrotekst czytelny.
- Batch ID: umieścić „adamski_card_v1” (A) i „adamski_card_v1B” (B) w obszarze spadu (np. w lewym dolnym rogu), rozmiar 6 pt.

## Zgodność z web design (spójność marki)

- Paleta: utrzymać industrial futurism, ciemne tła i chłodne akcenty; w druku użyć #00BFFF jako „tech blue”, w web primary #1F5CA0 oraz accent cyan #2DB8B8.
- Typografia: Inter + JetBrains Mono (spójne z design.json).
- Mikro-CTA: jasne komunikaty (PL/EN/NL), 2–4 słowa, przy QR/NFC z wyjaśnieniem „co się stanie”.