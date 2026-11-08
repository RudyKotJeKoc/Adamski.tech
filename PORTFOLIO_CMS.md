# Portfolio i panel CMS — instrukcja

## Jak to działa

- Każdy projekt to jeden plik JSON w `content/portfolio/projects/<slug>.json` z wersjami PL, EN i NL.
  Brakujące tłumaczenie automatycznie wraca do wersji polskiej.
- Strona wczytuje wszystkie pliki z tego katalogu przy budowaniu. Nowy plik = nowy projekt w galerii,
  bez zmian w kodzie.
- Po zapisaniu zmian w repozytorium (`main`) Netlify sam przebudowuje stronę (zwykle 1–2 minuty).
- Istniejące case studies (DAREMON Radio ETS, Home Assistant itd.) zostają w `content/content.json`.
  Ich kategorię, kolejność i widoczność w portfolio ustawia `content/portfolio/case-studies.json`.
- Kategorie: `content/portfolio/categories.json`.

## Statusy

| Pole | Znaczenie |
|------|-----------|
| **Status publikacji** `draft` / `published` | Wersja robocza jest niewidoczna dla odwiedzających. |
| **Status konstrukcji** (opcjonalny) | Koncepcja, W budowie, Testy, Ukończony, W eksploatacji, Modernizacja. Zostaw puste, jeśli nieokreślony — nie pojawi się na stronie. |

**Podgląd wersji roboczych na żywej stronie:** `https://adamski.tech/?drafts=1` (działa do końca sesji
przeglądarki, wyłączenie: `?drafts=0`). W trybie `pnpm dev` wersje robocze są widoczne zawsze.

## Dlaczego Decap CMS

Strona nie ma backendu ani bazy danych i nie potrzebuje ich. Decap CMS to sam interfejs, który zapisuje
pliki JSON i zdjęcia bezpośrednio w repozytorium GitHub. Nie ma serwera do utrzymania, nie ma osobnej bazy
ani nowego systemu kont: logowanie idzie przez GitHub (online) albo nie jest potrzebne (lokalnie).
Panel jest osobną stroną `/admin/` i nie zwiększa rozmiaru strony głównej.

## Edycja lokalna (bez logowania)

```bash
pnpm install
pnpm cms        # terminal 1 — lokalny serwer plików Decap (port 8081)
pnpm dev        # terminal 2 — strona
```

Otwórz `http://localhost:5173/admin/index.html` → **Zaloguj się** → edytuj. Zmiany trafiają od razu do
plików w repozytorium. Podgląd: `http://localhost:5173/portfolio/<slug>`. Na końcu `git commit` + `git push`.

## Edycja online — jednorazowa konfiguracja

Panel online: `https://adamski.tech/admin/`. Wymaga połączenia Netlify z GitHub OAuth:

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App
   - Homepage URL: `https://adamski.tech`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Netlify → ustawienia witryny → **Access control / OAuth** → zainstaluj dostawcę **GitHub**,
   wklej Client ID i Client Secret z kroku 1.
3. Wejdź na `https://adamski.tech/admin/` → zaloguj się kontem GitHub z dostępem do repozytorium.

Każdy zapis w panelu online to commit w gałęzi `main` (np. `cms: aktualizuj projects „prasa-hydrauliczna”`).

## Dodanie projektu bez panelu

Skopiuj dowolny plik z `content/portfolio/projects/`, zmień nazwę na nowy slug i uzupełnij pola.
Minimum: `title`, `slug`, `category`, `summary`, `status`. Wszystkie pozostałe sekcje są opcjonalne
i pojawiają się na stronie tylko wtedy, gdy mają treść:

| Pole | Na stronie |
|------|------------|
| `cover`, `cover_alt` | Zdjęcie główne karty i podstrony |
| `description` | Opis konstrukcji (akapity oddzielone pustą linią, `**pogrubienie**`) |
| `gallery[]` `{image, alt, caption}` | Galeria z powiększeniem (klawiatura, gesty) |
| `videos[]` `{url \| file, title}` | Filmy YouTube (ładowane po kliknięciu, tryb bez ciasteczek) lub własne MP4/WebM |
| `specs[]` `{label, value}` | Tabela parametrów technicznych |
| `technologies[]` | Znaczniki technologii (także filtr kompetencji w galerii) |
| `stages[]` `{title, date, description, images[]}` | Etapy budowy |
| `updates[]` `{date, title, description}` | Modernizacje i aktualizacje |
| `attachments[]` `{kind, label, file \| url}` | Schematy, CAD, modele 3D: obrazy jako galeria, pozostałe jako pliki do pobrania lub linki (np. Onshape, Printables) |
| `featured: true` | Duża karta na początku galerii |

## Zdjęcia

- Pliki trafiają do `public/assets/portfolio/`.
- Zalecane: JPG lub WebP, do ok. 2000 px szerokości, poziome 16:10 lub 4:3.
- Zawsze uzupełniaj tekst alternatywny (opis, co jest na zdjęciu).
- Grafiki poglądowe (nie zdjęcia konstrukcji) oznacz w `case-studies.json` jako `cover_is_placeholder: true` —
  strona pokaże je z etykietą „Wizualizacja poglądowa”.

## Bezpieczeństwo

Każdy dokument HTML ma własną politykę CSP:
- strona — ścisła (`vite.config.ts` → `SITE_CSP`, wstrzykiwana przy buildzie),
- panel `/admin/` — w `public/admin/index.html` (Decap wymaga `'unsafe-eval'`, dozwolone tylko tam).

Wspólne nagłówki (`frame-ancestors`, HSTS, nosniff…) są w `public/_headers`. Wersja Decap jest przypięta
(`3.16.3`), a plik skryptu weryfikowany przez SRI. Przy aktualizacji Decap zmień wersję w `index.html`
(adres, `integrity`) i w polityce CSP panelu.
