Style Guide – Adamski.tech (wizytówki A/B)

Paleta (druk, konwersja do CMYK FOGRA39 w prepress)
- Tło przemysłowe: #0D1117 (duże tła → rich black CMYK, np. C60 M40 Y40 K100)
- Akcent techniczny: #00BFFF (CMYK do potwierdzenia; unikać nadmiernego nasycenia)
- Tekst jasny: #EAEAEA (knock-out na tle; biel = papier gdzie właściwe)
- Czerń dla drobnicy/QR: 100K (nie 4C)

Typografia
- Inter (nagłówki, mikro-CTA)
- JetBrains Mono (detale techniczne, tagline)
- Rozmiary orientacyjne (do korekty po proof):
  - Imię i nazwisko: 7.0 pt (bold)
  - Tytuł: 4.2 pt (medium)
  - Kontakty: 3.4 pt
  - Mikro-CTA: 3.2 pt
- Kerning/tracking: standard; unikać kondensacji na drobnym tekście

Grid i marginesy
- Dokument: 91 × 61 mm (z bleed); trim: 85 × 55 mm
- Safe: 5 mm od cięcia (obszar 75 × 45 mm)
- Kolumny: 2 kolumny (lewa treści, prawa QR) na froncie; back – centralne wyrównanie dla „DAREMON” lub tagline

Pozycje elementów (A)
- Front: 
  - Name: top-left (x≈10 mm, y≈16 mm)
  - Title: y≈22 mm; tagi techniczne (mono) y≈26 mm
  - Kontakty: bottom-left (y≈48 mm i y≈52 mm)
  - QR vCard: bottom-right box 20×20 mm (x≈63 mm, y≈33 mm) + mikro-CTA nad QR
- Back:
  - „DAREMON” (SPOT UV) center; „adamski.tech” small bottom-center
  - Strefa NFC: prostokąt pomocniczy (x≈40 mm, y≈35 mm, 11×7 mm)

Pozycje elementów (B)
- Front: jak A, QR → portfolio; akcent diagonalny przy QR (mała „ostra” kreska)
- Back: tagline „PLC · Robotics · MIM · IoT · 3D” centrowany; QR → portfolio w prawym dolnym rogu

QR i mikro-CTA
- Wstawiaj QR z /assets/qr/qr_vcard.svg lub qr_portfolio.svg
- Utrzymuj quiet zone ≥ 4 moduły; dodatkowa biała ramka 20×20 mm
- Mikro-CTA: krótkie, 2–4 słowa (np. „Zeskanuj i zapisz kontakt”, „Zobacz portfolio”)

Uwagi produkcyjne
- Warstwy techniczne GUIDES/DIECUT/UV nie mogą drukować; oddzielne pliki separacji dla UV i wykrojnika
- Tekst drobny i QR: 100%K
- Duże tła: rich black
- Final: PDF/X-4, CMYK FOGRA39, osadzone fonty lub outline, brak przezroczystości

Powiązane pliki
- QR: /workspace/project_adamski_tech/assets/qr/
- vCard: /workspace/project_adamski_tech/assets/vcard/vcard.vcf
- NFC: /workspace/project_adamski_tech/nfc/nfc_payload.txt
- Mockups: /workspace/project_adamski_tech/design/mockups.md