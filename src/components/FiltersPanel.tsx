import type { Filters } from '../lib/filter';
import type { RadarConfig } from '../types/radar';

type Props = {
  config: RadarConfig;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export const FiltersPanel = ({ config, filters, onFiltersChange }: Props) => {
  const allTags = [...new Set(config.entries.flatMap((entry) => entry.tags))].sort();
  const maturityValues = [
    ...new Set(config.entries.map((entry) => entry.maturity ?? entry.status).filter(Boolean) as string[])
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <input
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        placeholder="Search name, description, tags"
        value={filters.search}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />

      <section>
        <h3 className="mb-2 text-sm font-semibold">Quadrants</h3>
        <div className="flex flex-wrap gap-2">
          {config.quadrants.map((quadrant) => (
            <button
              key={quadrant.id}
              onClick={() => onFiltersChange({ ...filters, quadrants: toggleValue(filters.quadrants, quadrant.id) })}
              className={`rounded-full px-3 py-1 text-sm ${filters.quadrants.includes(quadrant.id) ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              {quadrant.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Rings</h3>
        <div className="flex flex-wrap gap-2">
          {config.rings.map((ring) => (
            <button
              key={ring.id}
              onClick={() => onFiltersChange({ ...filters, rings: toggleValue(filters.rings, ring.id) })}
              className={`rounded-full px-3 py-1 text-sm ${filters.rings.includes(ring.id) ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
            >
              {ring.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">Tags</h3>
        <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onFiltersChange({ ...filters, tags: toggleValue(filters.tags, tag) })}
              className={`rounded-full px-3 py-1 text-xs ${filters.tags.includes(tag) ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {maturityValues.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">Maturity</h3>
          <div className="flex flex-wrap gap-2">
            {maturityValues.map((value) => (
              <button
                key={value}
                onClick={() => onFiltersChange({ ...filters, maturity: toggleValue(filters.maturity, value) })}
                className={`rounded-full px-3 py-1 text-sm ${filters.maturity.includes(value) ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold">Sort</h3>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={filters.sort}
          onChange={(event) => onFiltersChange({ ...filters, sort: event.target.value as Filters['sort'] })}
        >
          <option value="name">Name</option>
          <option value="lastUpdated">Last updated</option>
          <option value="ring">Ring order</option>
        </select>
      </section>
    </div>
  );
};
