import contentAll from '../../content/content.json';
import type { Locale } from '../components';

export type NavGroupId = 'start' | 'portfolio' | 'competences' | 'workshop' | 'media' | 'about' | 'contact';

export type NavItem = {
  id: string;
  label: string;
  group: NavGroupId;
  index: string;
};

export type NavGroup = { id: NavGroupId; label: string; items: NavItem[] };

/** Kolejność sekcji na stronie głównej — wyznacza też numerację HUD (00–10). */
export const SECTION_ORDER: { id: string; group: NavGroupId }[] = [
  { id: 'hero', group: 'start' },
  { id: 'projects', group: 'portfolio' },
  { id: 'skills', group: 'competences' },
  { id: 'brand', group: 'competences' },
  { id: 'equipment', group: 'workshop' },
  { id: 'ai', group: 'workshop' },
  { id: 'media', group: 'media' },
  { id: 'about', group: 'about' },
  { id: 'career', group: 'about' },
  { id: 'partners', group: 'contact' },
  { id: 'contact', group: 'contact' }
];

type NavContent = { navigation: Record<string, string>; navigation_groups?: Record<string, string> };

export const sectionIndex = (id: string) => {
  const i = SECTION_ORDER.findIndex((s) => s.id === id);
  return i < 0 ? '--' : String(i).padStart(2, '0');
};

export const buildNavItems = (locale: Locale): NavItem[] => {
  const nav = (contentAll as Record<Locale, NavContent>)[locale].navigation;
  return SECTION_ORDER.map((s) => ({
    id: s.id,
    label: nav[s.id] ?? s.id,
    group: s.group,
    index: sectionIndex(s.id)
  }));
};

export const buildNavGroups = (locale: Locale, items: NavItem[]): NavGroup[] => {
  const groupLabels = (contentAll as Record<Locale, NavContent>)[locale].navigation_groups ?? {};
  const order: NavGroupId[] = ['start', 'portfolio', 'competences', 'workshop', 'media', 'about', 'contact'];
  return order
    .map((id) => ({
      id,
      label: groupLabels[id] ?? items.find((i) => i.group === id)?.label ?? id,
      items: items.filter((i) => i.group === id)
    }))
    .filter((g) => g.items.length > 0);
};
