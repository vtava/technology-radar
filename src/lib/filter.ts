import type { RadarConfig, RadarEntry } from '../types/radar';

export type Filters = {
  search: string;
  quadrants: string[];
  rings: string[];
  tags: string[];
  maturity: string[];
  sort: 'name' | 'lastUpdated' | 'ring';
};

const ringOrderMap = (config: RadarConfig) =>
  new Map(config.rings.map((ring) => [ring.id, ring.order]));

export const filterEntries = (entries: RadarEntry[], filters: Filters, config: RadarConfig) => {
  const search = filters.search.trim().toLowerCase();
  const orderMap = ringOrderMap(config);

  return entries
    .filter((entry) => {
      if (
        search &&
        ![entry.name, entry.description, entry.tags.join(' ')].join(' ').toLowerCase().includes(search)
      ) {
        return false;
      }
      if (filters.quadrants.length > 0 && !filters.quadrants.includes(entry.quadrantId)) {
        return false;
      }
      if (filters.rings.length > 0 && !filters.rings.includes(entry.ringId)) {
        return false;
      }
      if (filters.tags.length > 0 && !filters.tags.some((tag) => entry.tags.includes(tag))) {
        return false;
      }
      if (filters.maturity.length > 0 && !filters.maturity.includes(entry.maturity ?? entry.status ?? '')) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'lastUpdated') return b.lastUpdated.localeCompare(a.lastUpdated);
      return (orderMap.get(a.ringId) ?? 999) - (orderMap.get(b.ringId) ?? 999);
    });
};
