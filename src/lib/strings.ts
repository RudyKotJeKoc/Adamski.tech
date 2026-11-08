import type { Locale } from '../components';
import type { BuildStatus, AttachmentKind } from './portfolio';

type UiStrings = {
  portfolio: {
    categoryFilterLabel: string;
    allCategories: string;
    skillFilterAll: string;
    results: (n: number) => string;
    empty: string;
    resetFilters: string;
    details: string;
    draft: string;
    draftsBanner: string;
    placeholderVisual: string;
    noPhoto: string;
  };
  project: {
    breadcrumbHome: string;
    breadcrumbPortfolio: string;
    back: string;
    overview: string;
    description: string;
    specs: string;
    technologies: string;
    gallery: string;
    videos: string;
    stages: string;
    updates: string;
    attachments: string;
    caseStudy: string;
    challenge: string;
    approach: string;
    outcome: string;
    metrics: string;
    links: string;
    category: string;
    status: string;
    period: string;
    contents: string;
    previous: string;
    next: string;
    contactTitle: string;
    contactText: string;
    contactCta: string;
    notFoundTitle: string;
    notFoundText: string;
    openImage: (n: number, total: number) => string;
    playVideo: (title: string) => string;
    openVideo: string;
    download: string;
    openLink: string;
    audioTitle: string;
  };
  lightbox: {
    dialogLabel: string;
    close: string;
    previous: string;
    next: string;
  };
  buildStatus: Record<BuildStatus, string>;
  attachmentKind: Record<AttachmentKind, string>;
  hero: {
    schematicTitle: string;
    status: {
      projects: string;
      categories: string;
      equipment: string;
      languages: string;
    };
  };
  nav: {
    index: string;
    indexTitle: string;
    close: string;
    open: string;
    mobileLabel: string;
    mainLabel: string;
    home: string;
  };
  media: {
    channel: string;
    videosTitle: string;
    fromProject: string;
    caseStudy: string;
  };
  skipToContent: string;
};

export const ui: Record<Locale, UiStrings> = {
  pl: {
    portfolio: {
      categoryFilterLabel: 'Kategoria',
      allCategories: 'Wszystkie',
      skillFilterAll: 'Wszystkie kompetencje',
      results: (n) => `${n} ${n === 1 ? 'projekt' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'projekty' : 'projektów'}`,
      empty: 'Brak projektów spełniających wybrane kryteria.',
      resetFilters: 'Wyczyść filtry',
      details: 'Szczegóły projektu',
      draft: 'Wersja robocza',
      draftsBanner: 'Tryb podglądu: widoczne są również wersje robocze, niewidoczne dla odwiedzających.',
      placeholderVisual: 'Wizualizacja poglądowa',
      noPhoto: 'Brak zdjęcia'
    },
    project: {
      breadcrumbHome: 'Start',
      breadcrumbPortfolio: 'Portfolio',
      back: 'Wróć do portfolio',
      overview: 'Przegląd',
      description: 'Opis konstrukcji',
      specs: 'Parametry techniczne',
      technologies: 'Zastosowane technologie',
      gallery: 'Galeria',
      videos: 'Filmy',
      stages: 'Etapy budowy',
      updates: 'Modernizacje i aktualizacje',
      attachments: 'Schematy, CAD i modele 3D',
      caseStudy: 'Case study',
      challenge: 'Wyzwanie',
      approach: 'Podejście',
      outcome: 'Rezultat',
      metrics: 'Kluczowe wskaźniki',
      links: 'Odnośniki',
      category: 'Kategoria',
      status: 'Status',
      period: 'Okres',
      contents: 'Zawartość strony projektu',
      previous: 'Poprzedni projekt',
      next: 'Następny projekt',
      contactTitle: 'Porozmawiajmy o podobnej konstrukcji',
      contactText: 'Masz pytanie o ten projekt lub potrzebujesz podobnego rozwiązania? Napisz — odpowiem z konkretami.',
      contactCta: 'Przejdź do kontaktu',
      notFoundTitle: 'Nie znaleziono projektu',
      notFoundText: 'Ten projekt nie istnieje albo nie został jeszcze opublikowany.',
      openImage: (n, total) => `Powiększ zdjęcie ${n} z ${total}`,
      playVideo: (title) => `Odtwórz film: ${title}`,
      openVideo: 'Otwórz film',
      download: 'Pobierz',
      openLink: 'Otwórz',
      audioTitle: 'Opis audio projektu'
    },
    lightbox: {
      dialogLabel: 'Podgląd zdjęcia',
      close: 'Zamknij podgląd',
      previous: 'Poprzednie zdjęcie',
      next: 'Następne zdjęcie'
    },
    buildStatus: {
      concept: 'Koncepcja',
      in_progress: 'W budowie',
      testing: 'Testy',
      completed: 'Ukończony',
      in_use: 'W eksploatacji',
      modernization: 'Modernizacja'
    },
    attachmentKind: {
      cad: 'CAD',
      schematic: 'Schemat',
      model: 'Model 3D',
      drawing: 'Rysunek',
      document: 'Dokument'
    },
    hero: {
      schematicTitle: 'Model warstwowy kompetencji',
      status: {
        projects: 'Projekty w portfolio',
        categories: 'Kategorie',
        equipment: 'Pozycje wyposażenia',
        languages: 'Języki'
      }
    },
    nav: {
      index: 'Indeks',
      indexTitle: 'Wszystkie sekcje',
      close: 'Zamknij menu',
      open: 'Otwórz menu',
      mobileLabel: 'Nawigacja mobilna',
      mainLabel: 'Główna nawigacja',
      home: 'Adamski.tech — strona główna'
    },
    media: {
      channel: 'Kanał YouTube',
      videosTitle: 'Filmy z projektów',
      fromProject: 'Projekt',
      caseStudy: 'Case study kanału'
    },
    skipToContent: 'Pomiń nawigację'
  },
  en: {
    portfolio: {
      categoryFilterLabel: 'Category',
      allCategories: 'All',
      skillFilterAll: 'All capabilities',
      results: (n) => `${n} ${n === 1 ? 'project' : 'projects'}`,
      empty: 'No projects match the selected filters.',
      resetFilters: 'Clear filters',
      details: 'Project details',
      draft: 'Draft',
      draftsBanner: 'Preview mode: drafts are visible here, but hidden from visitors.',
      placeholderVisual: 'Illustrative visual',
      noPhoto: 'No photo yet'
    },
    project: {
      breadcrumbHome: 'Home',
      breadcrumbPortfolio: 'Portfolio',
      back: 'Back to portfolio',
      overview: 'Overview',
      description: 'Build description',
      specs: 'Technical parameters',
      technologies: 'Technologies used',
      gallery: 'Gallery',
      videos: 'Videos',
      stages: 'Build stages',
      updates: 'Upgrades & updates',
      attachments: 'Schematics, CAD & 3D models',
      caseStudy: 'Case study',
      challenge: 'Challenge',
      approach: 'Approach',
      outcome: 'Outcome',
      metrics: 'Key metrics',
      links: 'Links',
      category: 'Category',
      status: 'Status',
      period: 'Period',
      contents: 'Project page contents',
      previous: 'Previous project',
      next: 'Next project',
      contactTitle: "Let's talk about a similar build",
      contactText: 'Questions about this project or need something similar? Get in touch for a concrete answer.',
      contactCta: 'Go to contact',
      notFoundTitle: 'Project not found',
      notFoundText: "This project doesn't exist or hasn't been published yet.",
      openImage: (n, total) => `Enlarge photo ${n} of ${total}`,
      playVideo: (title) => `Play video: ${title}`,
      openVideo: 'Open video',
      download: 'Download',
      openLink: 'Open',
      audioTitle: 'Project audio overview'
    },
    lightbox: {
      dialogLabel: 'Photo viewer',
      close: 'Close viewer',
      previous: 'Previous photo',
      next: 'Next photo'
    },
    buildStatus: {
      concept: 'Concept',
      in_progress: 'In progress',
      testing: 'Testing',
      completed: 'Completed',
      in_use: 'In service',
      modernization: 'Upgrade'
    },
    attachmentKind: {
      cad: 'CAD',
      schematic: 'Schematic',
      model: '3D model',
      drawing: 'Drawing',
      document: 'Document'
    },
    hero: {
      schematicTitle: 'Layered capability model',
      status: {
        projects: 'Portfolio projects',
        categories: 'Categories',
        equipment: 'Equipment items',
        languages: 'Languages'
      }
    },
    nav: {
      index: 'Index',
      indexTitle: 'All sections',
      close: 'Close menu',
      open: 'Open menu',
      mobileLabel: 'Mobile navigation',
      mainLabel: 'Main navigation',
      home: 'Adamski.tech — home'
    },
    media: {
      channel: 'YouTube channel',
      videosTitle: 'Project videos',
      fromProject: 'Project',
      caseStudy: 'Channel case study'
    },
    skipToContent: 'Skip to content'
  },
  nl: {
    portfolio: {
      categoryFilterLabel: 'Categorie',
      allCategories: 'Alle',
      skillFilterAll: 'Alle competenties',
      results: (n) => `${n} ${n === 1 ? 'project' : 'projecten'}`,
      empty: 'Geen projecten gevonden voor de gekozen filters.',
      resetFilters: 'Filters wissen',
      details: 'Projectdetails',
      draft: 'Concept',
      draftsBanner: 'Voorbeeldmodus: concepten zijn hier zichtbaar, maar verborgen voor bezoekers.',
      placeholderVisual: 'Illustratief beeld',
      noPhoto: 'Nog geen foto'
    },
    project: {
      breadcrumbHome: 'Start',
      breadcrumbPortfolio: 'Portfolio',
      back: 'Terug naar portfolio',
      overview: 'Overzicht',
      description: 'Beschrijving van de constructie',
      specs: 'Technische parameters',
      technologies: 'Gebruikte technologieën',
      gallery: 'Galerij',
      videos: "Video's",
      stages: 'Bouwfasen',
      updates: 'Modernisaties & updates',
      attachments: "Schema's, CAD & 3D-modellen",
      caseStudy: 'Case study',
      challenge: 'Uitdaging',
      approach: 'Aanpak',
      outcome: 'Resultaat',
      metrics: 'Kerncijfers',
      links: 'Links',
      category: 'Categorie',
      status: 'Status',
      period: 'Periode',
      contents: 'Inhoud van de projectpagina',
      previous: 'Vorig project',
      next: 'Volgend project',
      contactTitle: 'Laten we praten over een vergelijkbare constructie',
      contactText: 'Vragen over dit project of iets vergelijkbaars nodig? Neem contact op voor een concreet antwoord.',
      contactCta: 'Naar contact',
      notFoundTitle: 'Project niet gevonden',
      notFoundText: 'Dit project bestaat niet of is nog niet gepubliceerd.',
      openImage: (n, total) => `Foto ${n} van ${total} vergroten`,
      playVideo: (title) => `Video afspelen: ${title}`,
      openVideo: 'Video openen',
      download: 'Downloaden',
      openLink: 'Openen',
      audioTitle: 'Audio-overzicht van het project'
    },
    lightbox: {
      dialogLabel: 'Fotoviewer',
      close: 'Viewer sluiten',
      previous: 'Vorige foto',
      next: 'Volgende foto'
    },
    buildStatus: {
      concept: 'Ontwerpfase',
      in_progress: 'In aanbouw',
      testing: 'Testfase',
      completed: 'Voltooid',
      in_use: 'In gebruik',
      modernization: 'Modernisering'
    },
    attachmentKind: {
      cad: 'CAD',
      schematic: 'Schema',
      model: '3D-model',
      drawing: 'Tekening',
      document: 'Document'
    },
    hero: {
      schematicTitle: 'Gelaagd competentiemodel',
      status: {
        projects: 'Portfolioprojecten',
        categories: 'Categorieën',
        equipment: 'Uitrustingsitems',
        languages: 'Talen'
      }
    },
    nav: {
      index: 'Index',
      indexTitle: 'Alle secties',
      close: 'Menu sluiten',
      open: 'Menu openen',
      mobileLabel: 'Mobiele navigatie',
      mainLabel: 'Hoofdnavigatie',
      home: 'Adamski.tech — startpagina'
    },
    media: {
      channel: 'YouTube-kanaal',
      videosTitle: "Projectvideo's",
      fromProject: 'Project',
      caseStudy: 'Case study van het kanaal'
    },
    skipToContent: 'Naar inhoud'
  }
};
