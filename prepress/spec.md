Specyfikacja produkcyjna – wizytówki Adamski.tech (A/B)

Format i wymiary
- Rozmiar finalny: 85 × 55 mm (EU)
- Spady (bleed): 3 mm z każdej strony (łączny dokument: 91 × 61 mm)
- Margines bezpieczny (safe): 5 mm od linii cięcia (obszar bez krytycznych elementów: 75 × 45 mm)

Kolor i profil
- Profil kolorów: CMYK FOGRA39 (ISO Coated v2)
- Tła duże: rich black (np. C60 M40 Y40 K100) – do ustalenia z drukarnią
- Tekst drobny, linie cienkie, QR: czarny 100K (nie 4-kolorowa czerń)
- Biel: jako „papier”, bez overprintu
- Brak przezroczystości i mieszanych trybów; wszystkie elementy wektorowe

QR / NFC
- QR: 100%K, quiet zone ≥ 4 moduły (ustawione przy generacji kodu), brak kolorów mieszanych
- Rozmiar QR (druk): ~18–20 mm z białym tłem (quiet zone) wewnątrz safe; nie naruszać strefy ciszy
- NFC (NTAG213): strefa wskazana na tylnej stronie (A); potwierdzić z drukarnią pozycję względem bigu / wykończeń, brak metalizowanych farb w strefie

Typografia
- Nagłówki: Inter (bold/medium)
- Detale techniczne i tagline: JetBrains Mono
- Rozmiary przykładowe (przeskalować zgodnie z próbką proof):
  - Imię i nazwisko: ~7.0 pt równoważne mm w SVG (wizualna skala), bold
  - Tytuł: ~4.2 pt
  - Kontakty: ~3.4 pt
  - Mikro-CTA: ~3.2 pt
- Uwaga: w finalnym PDF/X-4 zaleca się konwersję tekstu do krzywych (outline) i osadzenie fontów

Układ (A/B)
- Wariant A (Industrial Minimal):
  - Front: góra-lewa imię i nazwisko (bold), niżej tytuł; dół-lewa: e-mail/www/tel; dół-prawa: QR vCard + mikro-CTA „Zeskanuj i zapisz kontakt”
  - Back: duże „DAREMON” (warstwa SPOT UV), małe „adamski.tech”; oznaczona strefa NFC
- Wariant B (Creative Tech):
  - Front: jak A, lecz QR kieruje do portfolio; diagonalny akcent #00BFFF przy QR; opcjonalny element „edge” (nacięcie) – potwierdzić
  - Back: tagline „PLC · Robotics · MIM · IoT · 3D”; QR → portfolio

Guidelines „edge” (wariant B)
- Offset od safe ≥ 2 mm
- Minimalna szerokość nacięcia ≥ 8 mm
- Promień narożnika ~1.5 mm
- Nie naruszać strefy ciszy QR i marginesu safe

Pliki i warstwy
- SVG wektorowe, bez rasterów i przezroczystości
- Warstwy techniczne:
  - GUIDES: linie trim/safe (usunąć przed finalnym PDF)
  - SPOT_UV: obszar lakieru UV (mapować do swatchu UV)
  - DIECUT_EDGE: linia nacięcia (do potwierdzenia z drukarnią)
- Finalny format dla drukarni: PDF/X-4 z osadzonymi fontami lub z tekstem skonwertowanym do krzywych

Uwagi do proof
- Zamówić proof drukarski; sprawdzić:
  - Czytelność QR z odległości 30–40 cm
  - Zgodność kolorów (CMYK FOGRA39)
  - Kontrast bieli (papier) vs tło
  - Wyrównanie krawędzi, nacięcie „edge” (jeśli stosowane)

Pytania do drukarni
- Preferowana receptura „rich black” dla tła?
- Czy możliwe jest zastosowanie spot UV na warstwie „DAREMON” bez wpływu na czytelność?
- Ograniczenia dla elementu „edge” (nacięcie): minimalna głębokość, tolerancje cięcia?
- Czy wymagają osobnych plików separacji dla SPOT UV i wykrojnika (DIECUT)?