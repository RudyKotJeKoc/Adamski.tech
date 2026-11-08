import contentAll from '../../content/content.json';
import categoriesFile from '../../content/portfolio/categories.json';
import caseStudiesFile from '../../content/portfolio/case-studies.json';
import type { Locale } from '../components';

export type PublishStatus = 'draft' | 'published';
export type BuildStatus = 'concept' | 'in_progress' | 'testing' | 'completed' | 'in_use' | 'modernization';
export type AttachmentKind = 'cad' | 'schematic' | 'model' | 'drawing' | 'document';

export type MediaImage = { src: string; alt: string; caption?: string };
export type ProjectVideo = { url: string; title: string; youtubeId: string | null };
export type ProjectSpec = { label: string; value: string };
export type ProjectStage = { title: string; date?: string; description?: string; images: MediaImage[] };
export type ProjectUpdate = { date?: string; title: string; description?: string };
export type ProjectAttachment = { kind: AttachmentKind; label: string; href: string; isImage: boolean; external: boolean };
export type ProjectCta = { label: string; href: string; variant?: string };
export type ProjectMetric = { label: string; value: string };

export type CaseStudyDetails = {
  tagline?: string;
  challenge?: string;
  approach: string[];
  outcome?: string;
  metrics: ProjectMetric[];
  ctas: ProjectCta[];
  audio?: string;
};

export type PortfolioCategory = { id: string; code: string; label: string };

export type PortfolioProject = {
  slug: string;
  source: 'portfolio' | 'case-study';
  status: PublishStatus;
  category: PortfolioCategory;
  order: number;
  featured: boolean;
  title: string;
  summary: string;
  description: string;
  buildStatus?: BuildStatus;
  period?: string;
  cover?: MediaImage & { placeholder: boolean };
  gallery: MediaImage[];
  videos: ProjectVideo[];
  specs: ProjectSpec[];
  technologies: string[];
  stages: ProjectStage[];
  updates: ProjectUpdate[];
  attachments: ProjectAttachment[];
  caseStudy?: CaseStudyDetails;
};

type Raw = Record<string, unknown>;

const BUILD_STATUSES: BuildStatus[] = ['concept', 'in_progress', 'testing', 'completed', 'in_use', 'modernization'];
const ATTACHMENT_KINDS: AttachmentKind[] = ['cad', 'schematic', 'model', 'drawing', 'document'];
const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i;

const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const hasValue = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : v !== null && v !== undefined;

/** Dopuszcza tylko ścieżki lokalne, http(s) i mailto — dane z CMS trafiają do atrybutów href/src. */
export const safeHref = (value: unknown): string => {
  const v = str(value);
  if (!v) return '';
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v)) return v;
  return '';
};

export const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export const youtubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www|m)\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0] ?? null;
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] ?? null;
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
};

export const toParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* ------------------------------------------------------------------ */
/* Kategorie                                                            */
/* ------------------------------------------------------------------ */

type RawCategory = { id: string; code: string; labels: Partial<Record<Locale, string>> };

const rawCategories: RawCategory[] = list((categoriesFile as Raw).categories)
  .filter(isObj)
  .map((c) => ({
    id: str(c.id),
    code: str(c.code) || str(c.id).slice(0, 3).toUpperCase(),
    labels: { pl: str(c.label_pl), en: str(c.label_en), nl: str(c.label_nl) }
  }))
  .filter((c) => c.id);

const resolveCategory = (id: string, locale: Locale): PortfolioCategory => {
  const found = rawCategories.find((c) => c.id === id) ?? rawCategories.find((c) => c.id === 'inne');
  if (!found) return { id: id || 'inne', code: 'GEN', label: id || 'Inne' };
  return { id: found.id, code: found.code, label: found.labels[locale] || found.labels.pl || found.id };
};

export const getCategories = (locale: Locale): PortfolioCategory[] => rawCategories.map((c) => resolveCategory(c.id, locale));

/* ------------------------------------------------------------------ */
/* Projekty z plików content/portfolio/projects/*.json (Decap CMS)       */
/* ------------------------------------------------------------------ */

const projectModules = import.meta.glob<Raw>('../../content/portfolio/projects/*.json', {
  eager: true,
  import: 'default'
});

/** Format i18n Decap "single_file": { pl: {...}, en: {...}, nl: {...} }; brakujące tłumaczenia wracają do PL. */
const localize = (raw: Raw, locale: Locale): Raw => {
  const base = isObj(raw.pl) ? raw.pl : raw;
  const translated = isObj(raw[locale]) ? (raw[locale] as Raw) : {};
  const merged: Raw = { ...base };
  for (const [key, value] of Object.entries(translated)) {
    if (hasValue(value)) merged[key] = value;
  }
  return merged;
};

const toImage = (value: unknown, fallbackAlt: string): MediaImage | null => {
  if (typeof value === 'string') {
    const src = safeHref(value);
    return src ? { src, alt: fallbackAlt } : null;
  }
  if (!isObj(value)) return null;
  const src = safeHref(value.image ?? value.src ?? value.file);
  if (!src) return null;
  const caption = str(value.caption);
  return { src, alt: str(value.alt) || caption || fallbackAlt, caption: caption || undefined };
};

const toImages = (value: unknown, fallbackAlt: string) =>
  list(value)
    .map((item, index) => toImage(item, `${fallbackAlt} — ${index + 1}`))
    .filter((img): img is MediaImage => img !== null);

const fromPortfolioFile = (raw: Raw, fileSlug: string, locale: Locale): PortfolioProject | null => {
  const d = localize(raw, locale);
  const title = str(d.title);
  if (!title) return null;
  const slug = slugify(str(d.slug) || fileSlug);
  const coverSrc = safeHref(d.cover);
  const buildStatus = str(d.build_status) as BuildStatus;

  return {
    slug,
    source: 'portfolio',
    status: str(d.status) === 'published' ? 'published' : 'draft',
    category: resolveCategory(str(d.category), locale),
    order: Number.isFinite(Number(d.order)) && str(d.order) !== '' ? Number(d.order) : 999,
    featured: d.featured === true,
    title,
    summary: str(d.summary),
    description: str(d.description),
    buildStatus: BUILD_STATUSES.includes(buildStatus) ? buildStatus : undefined,
    period: str(d.period) || undefined,
    cover: coverSrc ? { src: coverSrc, alt: str(d.cover_alt) || title, placeholder: false } : undefined,
    gallery: toImages(d.gallery, title),
    videos: list(d.videos)
      .filter(isObj)
      .map((v) => {
        const url = safeHref(v.url ?? v.file);
        return { url, title: str(v.title) || title, youtubeId: url ? youtubeId(url) : null };
      })
      .filter((v) => v.url),
    specs: list(d.specs)
      .filter(isObj)
      .map((s) => ({ label: str(s.label), value: str(s.value) }))
      .filter((s) => s.label && s.value),
    technologies: list(d.technologies)
      .map((t) => (isObj(t) ? str(t.name ?? t.label) : str(t)))
      .filter(Boolean),
    stages: list(d.stages)
      .filter(isObj)
      .map((s) => ({
        title: str(s.title),
        date: str(s.date) || undefined,
        description: str(s.description) || undefined,
        images: toImages(s.images, str(s.title) || title)
      }))
      .filter((s) => s.title),
    updates: list(d.updates)
      .filter(isObj)
      .map((u) => ({ date: str(u.date) || undefined, title: str(u.title), description: str(u.description) || undefined }))
      .filter((u) => u.title),
    attachments: list(d.attachments)
      .filter(isObj)
      .map((a) => {
        const href = safeHref(a.file) || safeHref(a.url);
        const kind = str(a.kind) as AttachmentKind;
        return {
          kind: ATTACHMENT_KINDS.includes(kind) ? kind : 'document',
          label: str(a.label) || href.split('/').pop() || '',
          href,
          isImage: IMAGE_EXT.test(href),
          external: isExternalHref(href)
        };
      })
      .filter((a) => a.href)
  };
};

/* ------------------------------------------------------------------ */
/* Istniejące case studies z content.json (dane zostają na miejscu)       */
/* ------------------------------------------------------------------ */

type LegacyItem = {
  name: string;
  tagline?: string;
  summary?: string;
  challenge?: string;
  approach?: string[];
  outcome?: string;
  metrics?: ProjectMetric[];
  skills?: string[];
  image?: { src: string; alt: string };
  ctas?: ProjectCta[];
  audio?: string;
};

type CaseStudyMeta = { slug: string; category?: string; status?: string; order?: number; cover_is_placeholder?: boolean };

const caseStudyMeta = new Map<string, CaseStudyMeta>(
  list((caseStudiesFile as Raw).items)
    .filter(isObj)
    .map((m) => [str(m.slug), m as unknown as CaseStudyMeta])
);

export const legacySlug = (item: LegacyItem) => {
  for (const cta of item.ctas ?? []) {
    const match = cta.href?.match(/\/case-studies\/([a-z0-9-]+)/);
    if (match) return match[1];
  }
  return slugify(item.name);
};

const legacyItems = (locale: Locale): LegacyItem[] =>
  ((contentAll as Record<Locale, { projects?: { items?: unknown[] } }>)[locale]?.projects?.items ?? []) as LegacyItem[];

const fromLegacy = (item: LegacyItem, index: number, locale: Locale): PortfolioProject => {
  const slug = legacySlug(item);
  const meta = caseStudyMeta.get(slug);
  const coverSrc = safeHref(item.image?.src);
  return {
    slug,
    source: 'case-study',
    status: meta?.status === 'draft' ? 'draft' : 'published',
    category: resolveCategory(meta?.category ?? 'inne', locale),
    order: typeof meta?.order === 'number' ? meta.order : 500 + index,
    featured: false,
    title: item.name,
    summary: item.summary || item.tagline || '',
    description: '',
    cover: coverSrc
      ? { src: coverSrc, alt: item.image?.alt || item.name, placeholder: meta?.cover_is_placeholder === true }
      : undefined,
    gallery: [],
    videos: [],
    specs: [],
    technologies: (item.skills ?? []).filter(Boolean),
    stages: [],
    updates: [],
    attachments: [],
    caseStudy: {
      tagline: item.tagline,
      challenge: item.challenge,
      approach: item.approach ?? [],
      outcome: item.outcome,
      metrics: item.metrics ?? [],
      ctas: (item.ctas ?? [])
        .map((cta) => ({ ...cta, href: safeHref(cta.href) }))
        .filter((cta) => cta.href && cta.label),
      audio: safeHref(item.audio) || undefined
    }
  };
};

/* ------------------------------------------------------------------ */
/* API                                                                  */
/* ------------------------------------------------------------------ */

const cache = new Map<Locale, PortfolioProject[]>();

const allProjects = (locale: Locale): PortfolioProject[] => {
  const cached = cache.get(locale);
  if (cached) return cached;

  const fromFiles = Object.entries(projectModules)
    .map(([path, raw]) => fromPortfolioFile(raw, path.split('/').pop()!.replace(/\.json$/, ''), locale))
    .filter((p): p is PortfolioProject => p !== null);

  const seen = new Set(fromFiles.map((p) => p.slug));
  const fromCaseStudies = legacyItems(locale)
    .map((item, index) => fromLegacy(item, index, locale))
    .filter((p) => !seen.has(p.slug));

  const result = [...fromFiles, ...fromCaseStudies].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title, locale)
  );
  cache.set(locale, result);
  return result;
};

export const getProjects = (locale: Locale, includeDrafts = false) =>
  allProjects(locale).filter((p) => includeDrafts || p.status === 'published');

export const findProject = (slug: string, locale: Locale, includeDrafts = false) =>
  getProjects(locale, includeDrafts).find((p) => p.slug === slug);

export const projectHref = (project: Pick<PortfolioProject, 'slug'>) => `/portfolio/${project.slug}`;

/** Projekt opisuje własną podstronę linkiem /case-studies/<slug> — na tej podstronie link do siebie jest zbędny. */
export const isSelfCaseStudyLink = (href: string, slug: string) =>
  new RegExp(`/case-studies/${slug}/?$`).test(href);

const DRAFTS_KEY = 'adamski:drafts';

/** Wersje robocze: zawsze w trybie deweloperskim, na produkcji po wejściu z parametrem ?drafts=1 (do końca sesji). */
export const draftsVisible = (): boolean => {
  if (import.meta.env.DEV) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('drafts')) sessionStorage.setItem(DRAFTS_KEY, params.get('drafts') === '0' ? '0' : '1');
    return sessionStorage.getItem(DRAFTS_KEY) === '1';
  } catch {
    return false;
  }
};
