QA — Daremon Engineering: Wizytówka (druk) + Web landingi (/qr/biz, /hans)

Podsumowanie statusu
- Druk: Needs Fix przed „Go to print” (brak finalnych PDF/X-4, placeholder telefonu w vCard, brak oznaczenia batch ID przy spadzie, do potwierdzenia LinkedIn).
- Web: OK (routy, SPA, i18n, UTM, vCard w public), Needs Fix dla meta/hreflang oraz rekomendowany audyt Lighthouse.

Zakres weryfikacji — Druk (wizytówka A/B)
1) Tekst PL/EN/NL (długości, literówki)
- Źródła: /workspace/project_adamski_tech/copy/card.json, /workspace/project_adamski_tech/copy/cta.json
- Status: OK (zwięzłe, jednowierszowe linie dla name/title; micro-CTA krótkie: PL/EN/NL)
- Rekomendacja: utrzymanie jednowierszowych linii; po potwierdzeniu telefonu zaktualizować contact_line.

2) Micro-CTA przy QR/NFC (2–4 słowa, jasno „co się stanie”)
- Status: OK (np. „Zeskanuj i zapisz kontakt” / „Scan to save contact”)
- Rekomendacja: zachować czytelność i kontrast; rozmiar czcionki ≥ 2.7 mm (wg style.json).

3) QR (skanowalność)
- Pliki: /workspace/project_adamski_tech/assets/qr/qr_vcard.svg, /workspace/project_adamski_tech/assets/qr/qr_portfolio.svg
- Generacja: node-qrcode, ECC=Q, margin=4
- Status: OK (specyfikacja), Needs Test (druk próbny)
- Wymogi: quiet zone ≥ 4 moduły, minimalny rozmiar ≥ 16×16 mm, 100%K
- Rekomendacja: potwierdzić w prepress konwersję na 100K (CMYK) oraz test druku 30–40 cm na min. 5 telefonach.

4) NFC (NTAG213, NDEF URI)
- Payload: /workspace/project_adamski_tech/nfc/nfc_payload.txt
- Status: OK (payload z UTM)
- Rekomendacja: test na min. 5 telefonach; lock=off w fazie testów; dopiero po akceptacji finalnej lock=on.

5) Specyfikacja druku
- Spec: /workspace/project_adamski_tech/prepress/spec.md, style guide: /workspace/project_adamski_tech/style_guide_adamski.md
- Status: OK
- Kluczowe parametry: 85×55 mm, bleed 3 mm, safe 5 mm, CMYK FOGRA39 (ISO Coated v2), czarny tekst 100K, QR 100%K, biel = papier (no overprint), rich black tylko dla dużych tł.
- Rekomendacja: doprecyzować w PDF/X-4 eksport „text 100K” i „QR 100%K”.

6) Wariant B — „edge”
- Wytyczne: style.json (edge_cut_guidelines), mockups.md
- Status: OK (guidelines istnieją)
- Rekomendacja: upewnić się, że „edge” nie narusza quiet zone QR (offset od safe ≥ 2 mm, min szer. ≥ 8 mm, promień 1.5 mm).

7) Batch ID (A/B, adamski_card_v1, v2, …)
- Status: Needs Fix (brak oznaczenia batch ID przy spadzie)
- Rekomendacja: dodać dyskretną notację batch, np. „adamski_card_v1” w rogu przy spadzie (poza safe), czcionka ~5 pt, 100K.

8) Finalny format plików do druku
- Status: Needs Fix
- Obecnie: SVG front/back (A/B)
- Wymagane: PDF/X-4 (CMYK FOGRA39, fonty osadzone, text 100K, QR 100%K)
- Rekomendacja eksportu:
  - Eksport z edytora (np. Adobe Illustrator / Affinity / Inkscape):
    - CMYK profil: ISO Coated v2 (FOGRA39)
    - PDF standard: PDF/X-4
    - Embed fonts: Inter, JetBrains Mono
    - Black for text: 0/0/0/100 K
    - QR: 100%K (bez 4C), bez przezroczystości
    - Biel: „paper”, overprint off

9) Telefon w vCard (druk vs. tylko vCard)
- Status: Needs Fix (placeholder „TODO:+31683128848”)
- Rekomendacja: potwierdzić numer (E.164: +31683128848); zaktualizować vcard.vcf i przegenerować qr_vcard.svg; zdecydować czy telefon drukować na froncie (A/B) czy pozostawić tylko w vCard.

10) LinkedIn (opcjonalnie)
- Status: Needs Decision (brak URL)
- Rekomendacja: jeśli profil aktywny, dodać ikonę/link (druk/web); w druku — ikona dyskretna, 100K na jasnym tle.

Zakres weryfikacji — Web
1) Routy i SPA
- Pliki: /workspace/project_adamski_tech/src/routes/QRBiz.tsx, /workspace/project_adamski_tech/src/routes/Hans.tsx, /workspace/project_adamski_tech/src/main.tsx, /workspace/project_adamski_tech/public/_redirects
- Status: OK (SPA działa; _redirects: /* /index.html 200)

2) i18n i UTM
- Źródła: /workspace/project_adamski_tech/copy/cta.json, /workspace/project_adamski_tech/copy/landing_intro.json, content.json
- Status: OK (przełącznik PL/EN/NL, zachowanie UTM)
- Rekomendacja: utrzymać parametry UTM bez nadpisywania historii wejścia.

3) SEO meta/hreflang
- Status: Needs Fix
- Rekomendacja: ustawić dynamiczne meta-title/description i hreflang dla /qr/biz i /hans; title ≤ 60 znaków, description ~150–160, canonical.

4) Performance/Accessibility (Lighthouse — symulacja)
- Status: OK (bazowa zgodność), Needs Fix (audyt i ewentualne poprawki)
- Rekomendacja: Lighthouse dla mobile; focus-visible, alt, aria-labels, kontrasty WCAG AA (design.json).

5) vCard w public
- Plik: /workspace/project_adamski_tech/public/vcard.vcf
- Status: OK (do pobrania)

6) Deployment plan
- Plik: /workspace/project_adamski_tech/deployment/deployment_plan.md
- Status: OK (Nginx/Netlify, try_files dla SPA, przykładowe 302 dla /qr/biz i /hans)
- Rekomendacja: wybrać hosting (Synology/Nginx+SSL lub Netlify) i wdrożyć zgodnie z planem; opcjonalnie dodać lekkie analytics (Plausible).

Rekomendacje — konkretne kroki i pliki do zmiany
- Potwierdź numer telefonu: +31683128848 (E.164). Zaktualizuj: /workspace/project_adamski_tech/assets/vcard/vcard.vcf, przegeneruj: /workspace/project_adamski_tech/assets/qr/qr_vcard.svg (komenda w readme_hand-off.md).
- Batch ID: dodaj notację „adamski_card_v1” przy spadzie w plikach SVG: card_front_A.svg, card_back_A.svg, card_front_B.svg, card_back_B.svg (poza safe area).
- Eksport PDF/X-4: wyeksportuj front/back A/B z CMYK FOGRA39, embed fonts; sprawdź 100K dla tekstu i 100%K dla QR.
- SEO: dodaj meta tytuły/opisy i hreflang dla /qr/biz i /hans (w React lub w serwowanym index.html per route).
- Lighthouse: uruchom audyt; popraw focus-visible, alt/aria, kontrasty.
- LinkedIn: decyzja „tak/nie”; jeśli „tak”, podaj URL i dodaj ikonę/link w druku i na web.
- Druk próbny: test QR z 30–40 cm na min. 5 telefonach; test NFC payload na min. 5 telefonach (lock=off).

Załączniki/Ścieżki referencyjne
- Prepress: /workspace/project_adamski_tech/prepress/card_front_A.svg, card_back_A.svg, card_front_B.svg, card_back_B.svg, spec.md
- Style guide: /workspace/project_adamski_tech/style_guide_adamski.md
- QR/VCF/NFC: /workspace/project_adamski_tech/assets/qr/qr_vcard.svg, qr_portfolio.svg; /workspace/project_adamski_tech/assets/vcard/vcard.vcf; /workspace/project_adamski_tech/nfc/nfc_payload.txt; /workspace/project_adamski_tech/readme_hand-off.md
- Web: /workspace/project_adamski_tech/src/routes/QRBiz.tsx, Hans.tsx, main.tsx; /workspace/project_adamski_tech/public/_redirects; /workspace/project_adamski_tech/dist/

Status końcowy
- Druk: Needs Fix (PDF/X-4, telefon, batch ID, decyzja LinkedIn) — po poprawkach: Ready for print proof.
- Web: OK do podglądu; Needs Fix (SEO meta/hreflang i Lighthouse poprawki) — po poprawkach: Ready to publish.

