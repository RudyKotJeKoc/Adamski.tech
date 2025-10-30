Architektura UX/UI – Adamski.tech (one-page)

Cel: Profesjonalna, interaktywna wizytówka inżyniera utrzymania ruchu i automatyka (Daremon). Styl: techniczny minimalizm + industrial futurism. Inspiracje: Tesla / GitHub / Figma dark. Domyślnie tryb dark, mobile-first, i18n PL/EN/NL.

1) Drzewo logiczne HTML z opisami

- html[lang="pl|en|nl"][class="dark"]
  - head
    - meta[charset="utf-8"]
    - meta[name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"]
    - title: z content.meta.title (per język)
    - meta[name="description"]: z content.meta.description (per język)
    - meta[name="theme-color" content="#0b1220"] (kolor motywu w trybie dark)
    - link[rel="preconnect" href="https://fonts.googleapis.com"]
    - link[rel="preconnect" href="https://fonts.gstatic.com" crossorigin]
    - link[rel="stylesheet" href="...czcionki z design.json..."]
    - link[rel="canonical" href="https://adamski.tech"]
    - meta[property="og:title"] / meta[property="og:description"] / meta[property="og:url"] / meta[property="og:image"]
    - script[type="application/ld+json"] (JSON-LD Person + Website; TODO: uzupełnić dane kontaktowe)
  - body
    - a.skip-link[href="#main"] (widoczny przy focus; tekst: "Pomiń nawigację")
    - header[role="banner"][class="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40"]
      - nav[aria-label="Główna nawigacja"]
        - div.logo
          - a[href="#hero"][aria-label="Adamski.tech – strona główna"] (znak/wordmark: "Daremon Engineering")
        - button.menu-toggle[aria-controls="primary-nav"][aria-expanded="false"] (hamburger mobile)
        - ul#primary-nav[role="menubar"]
          - li -> a[href="#hero"] (label per język: navigation.hero)
          - li -> a[href="#about"] (navigation.about)
          - li -> a[href="#skills"] (navigation.skills)
          - li -> a[href="#projects"] (navigation.projects)
          - li -> a[href="#contact"] (navigation.contact)
        - div.actions
          - div.lang-switcher[role="group" aria-label="Wybór języka"]
            - button[data-lang="pl" aria-pressed="true|false"] "PL"
            - button[data-lang="en" aria-pressed="true|false"] "EN"
            - button[data-lang="nl" aria-pressed="true|false"] "NL"
          - a.cta-primary[href="#contact" role="button"] "Skontaktuj się" (przycisk główny)
    - main#main
      - section#hero[aria-labelledby="hero-title"]
        - div.background (gradienty LED, delikatny glow; maska siatki/„stal”)
        - h1#hero-title: content.hero.title
        - p.hero-subtitle: content.hero.subtitle
        - div.hero-ctas
          - a.btn-primary[href="#contact"] content.hero.cta_primary
          - a.btn-secondary[href="#projects"] content.hero.cta_secondary
        - div.hero-meta (mini-lista: kluczowe liczby/punkty; np. lata doświadczenia, branże; TODO: doprecyzować)
      - section#about[aria-labelledby="about-title"]
        - h2#about-title: content.about.title
        - p.about-lead: content.about.lead
        - div.about-grid
          - article.about-card (bio skrócony, wartości, podejście do automatyzacji)
          - article.about-card (obszary pracy: utrzymanie ruchu, IoT, druk 3D, MIM; TODO: linki)
          - article.about-card (kluczowe osiągnięcia/„proof points”; TODO: przykłady)
      - section#skills[aria-labelledby="skills-title"]
        - h2#skills-title: content.skills.title
        - div.skills-filters (chips: kategorie; bez przeładowania)
        - ul.skills-grid[role="list"] (kartowe, semantyczne)
          - li.skill-card
            - h3: nazwa kategorii (np. Automatyka)
            - ul[role="list"] tagi/technologie (PLC, SCADA, IoT, CAD, druk 3D, itp.)
            - div.badges (poziom biegłości – tekstowy; bez „progress barów” dla prostoty)
      - section#projects[aria-labelledby="projects-title"]
        - h2#projects-title: content.projects.title
        - div.project-filters (opcjonalne chipsy: Przemysł, IoT, DIY, 3D – lekkie filtrowanie klient-side)
        - div.project-grid
          - article.project-card
            - figure
              - img[src="assets/placeholder.jpg" alt="Miniatura projektu: TODO: nazwa"] (lazy)
              - figcaption (krótki opis; content.projects.items[].summary)
            - h3: content.projects.items[].title
            - p: content.projects.items[].description (1–2 zdania)
            - ul.tags (technologie/obszar)
            - div.actions
              - a[href="TODO: link do repo/case-study"] "Szczegóły"
              - a[href="TODO: demo"] "Demo" (jeśli istnieje)
        - div.projects-cta (link do kontaktu: „Chcesz podobne wdrożenie? Skontaktuj się”)
      - section#contact[aria-labelledby="contact-title"]
        - h2#contact-title: content.contact.title
        - p.contact-lead: content.contact.lead
        - form#contact-form[aria-describedby="contact-note"]
          - label[for="name"] "Imię i nazwisko"
          - input#name[name="name" required autocomplete="name"]
          - label[for="email"] "Email"
          - input#email[type="email" name="email" required autocomplete="email"]
          - label[for="message"] "Wiadomość"
          - textarea#message[name="message" rows="6" required]
          - div.form-actions
            - button[type="submit"] "Wyślij"
            - a[href="mailto:TODO:email"] "Wyślij email"
          - small#contact-note "Dane wykorzystane wyłącznie do kontaktu. TODO: link do polityki prywatności."
        - div.contact-alt (ikonki: LinkedIn, GitHub, telefon; TODO: linki)
    - footer[role="contentinfo"]
      - nav.footer-nav
        - a[href="#hero"] "Start"
        - a[href="#about"] "O mnie"
        - a[href="#skills"] "Umiejętności"
        - a[href="#projects"] "Projekty"
        - a[href="#contact"] "Kontakt"
      - div.footer-meta
        - small "© {rok} Dariusz Adamski — Adamski.tech"
        - small "Zaprojektowano w duchu industrial futurism"
    - noscript (komunikat o ograniczonej funkcjonalności: brak animacji/filtrowania; i18n stałe PL)

2) Założenia interakcji i animacji

- Smooth scroll:
  - Linki nawigacji i CTA przewijają płynnie do sekcji (scroll-behavior: smooth; dodatkowo JS dla offsetu sticky header).
  - Każda sekcja posiada scroll-margin-top zgodny z wysokością headera, by uniknąć zasłaniania tytułu.

- Sticky nav + aktywny link:
  - Header „sticky” z tłem półprzezroczystym (backdrop-blur), aktywny stan linku na podstawie IntersectionObserver.
  - Po przewinięciu sekcji >50% wysokości – podświetl odpowiedni link (underline/marker LED).

- Wejścia na scroll (fade/slide):
  - Elementy sekcji pojawiają się z opóźnieniem kaskadowym (fade-in + slide-in 12–24px).
  - Czas: 250–400ms; funkcja: cubic-bezier(0.22, 1, 0.36, 1).
  - Włączane przez IntersectionObserver; raz-aktywowane, z możliwością reanimacji przy re-enterze sekcji.

- Hover/focus:
  - Przyciski i karty: delikatny podbłysk (shadow-sm -> shadow-md), obrys LED (outline o wysokim kontraście).
  - Focus visible: wyraźny ring (np. #60A5FA na ciemnym tle), zachowany kontrast i grubość 2–3px.
  - Ikony: subtelna rotacja 2–3° lub przesunięcie 2px przy hover (opcjonalnie).

- I18n przełącznik (PL/EN/NL):
  - W headerze, jako trójstanowy przełącznik (segmentowany lub trzy przyciski).
  - Zmiana języka:
    - Aktualizuje content UI z content.json.
    - Ustawia html[lang] oraz aria-labels odpowiednio do języka.
    - Zapamiętuje wybór w localStorage ("locale"), domyślnie: język przeglądarki jeśli wspierany, inaczej "pl".
  - Dostępność:
    - Role="group", aria-label="Wybór języka", przyciski z aria-pressed.
    - Brak flag; tylko kody językowe (PL/EN/NL) dla neutralności.
  - Mobile:
    - W menu mobilnym przełącznik dostępny w panelu; po wyborze zamyka panel i zachowuje focus.

- CTA:
  - Główne: „Skontaktuj się” w Hero; prowadzi do #contact.
  - Pomocnicze: „Zobacz projekty” w Hero, „Szczegóły” na kartach projektów.
  - Na urządzeniach mobilnych przyciski o pełnej szerokości, na desktop – dopasowane.

- Preferencje użytkownika (motion/contrast):
  - respects: prefers-reduced-motion — animacje ograniczone do prostego fade (bez slide).
  - Kontrast i dark mode zgodne z WCAG AA.

3) Responsywność i układy (mobile-first)

- Siatka i szerokości:
  - max-w-screen-xl, padding-x: 16–24px mobile, 32px tablet, 48px desktop.
  - Gap sekcji: 64px mobile, 96px tablet, 128px desktop.

- Header:
  - Mobile (≤640px): logo + hamburger; menu pełnoekranowe (overlay), linki w kolumnie; lang-switcher i CTA w dolnym obszarze overlay.
  - Tablet (641–1024px): menu jako row z ukryciem mniej istotnych linków; CTA widoczne.
  - Desktop (≥1025px): pełny pasek, linki w linii, lang-switcher po prawej, CTA jako przycisk akcentowy.

- Hero:
  - Mobile: układ kolumnowy (stack), tytuł H1, podtytuł, CTA pełnej szerokości; tło gradient/LED glow subtelne.
  - Tablet: CTA w linii, obok meta punktów; ilustracja tła większa.
  - Desktop: dwie kolumny: lewa (tekst + CTA), prawa (grafika/moodboard abstrakcyjny).

- About:
  - Mobile: pojedyncza kolumna; trzy karty pod sobą.
  - Tablet: 2 kolumny (2+1).
  - Desktop: 3 kolumny (równomiernie).

- Skills:
  - Mobile: siatka 2 kolumny; karty kompaktowe.
  - Tablet: 3 kolumny; większe odstępy.
  - Desktop: 4 kolumny; więcej tagów na kartę.

- Projects:
  - Mobile: 1 kolumna; karty pełnej szerokości, obrazki 16:9.
  - Tablet: 2 kolumny.
  - Desktop: 3 kolumny; hover efekty; filtry w linii nad siatką.

- Contact:
  - Mobile: formularz w jednej kolumnie; przyciski pełnej szerokości.
  - Tablet: pola w dwóch kolumnach (name/email w jednej linii).
  - Desktop: 2 kolumny: formularz + kontakt alternatywny (social/telefon).

- Footer:
  - Mobile: linki w dwóch rzędach; meta poniżej.
  - Desktop: trzy kolumny: nawigacja, social, meta.

4) Dostępność i SEO

- Semantyka:
  - Elementy: header, nav, main, section, article, figure, footer.
  - Hierarchia nagłówków: H1 (Hero), H2 (sekcje), H3 (karty).
  - Skip link do #main.

- Kontrast:
  - Kolory dark z kontrastem min 4.5:1 dla tekstu; przyciski i linki z wyraźnym stanem focus/hover.

- ARIA i etykiety:
  - Nav: aria-label="Główna nawigacja".
  - Przełącznik języka: role="group", aria-pressed.
  - Formularz: label for każde pole; aria-describedby dla noty.
  - Ikony: aria-hidden="true" jeżeli dekoracyjne; alt dla obrazów projektów.

- Klawiatura:
  - Pełna nawigacja po TAB; widoczny focus-ring.
  - Menu mobilne: trap focus w otwartym overlay, ESC zamyka, przywraca focus na przycisku.

- Preferencje użytkownika:
  - prefers-reduced-motion: minimalne animacje.
  - prefers-color-scheme: dark jako domyślny; możliwość jasnego motywu w przyszłości.

- SEO techniczne:
  - Meta title (≤60 znaków) i description (150–160), z content.json per język.
  - Canonical https://adamski.tech.
  - Open Graph i Twitter Card (Summary Large Image).
  - Lazy-loading obrazów, width/height zdefiniowane, formaty nowoczesne (AVIF/WebP).
  - Preload kluczowych fontów; font-display: swap.
  - JSON-LD: Person (name, jobTitle, sameAs: LinkedIn/GitHub) + WebSite + ContactPoint (TODO: wypełnić).

- Wydajność:
  - Obrazy optymalizowane; CSS krytyczne inline ograniczone; reszta asynchronicznie.
  - Minimalizacja JS; brak ciężkich bibliotek animacyjnych — użycie IntersectionObserver + CSS transitions.

Uwaga/Założenia:
- Brak backendu wskazanego w tej chwili — formularz może używać mailto: lub prostego webhooka w przyszłości (TODO: decyzja).
- Lista projektów, linki i dane kontaktowe będą uzupełnione przez Copywritera (content.json, pola TODO).
- Design tokens (kolory, typografia, cienie) dostarcza design.json i będą mapowane w tailwind.config.js (theme.extend).