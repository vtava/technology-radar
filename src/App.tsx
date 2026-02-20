import { useEffect, useMemo, useState } from 'react';
import { EntryDrawer } from './components/EntryDrawer';
import { EntriesList } from './components/EntriesList';
import { FiltersPanel } from './components/FiltersPanel';
import { RadarChart } from './components/RadarChart';
import { filterEntries, type Filters } from './lib/filter';
import { radarSchema } from './lib/schema';
import type { RadarConfig, RadarEntry } from './types/radar';

const defaultFilters: Filters = {
  search: '',
  quadrants: [],
  rings: [],
  tags: [],
  maturity: [],
  sort: 'ring'
};

function App() {
  const [config, setConfig] = useState<RadarConfig | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selected, setSelected] = useState<RadarEntry | null>(null);
  const [view, setView] = useState<'radar' | 'list'>('radar');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/data/radar.json')
      .then((response) => response.json())
      .then((json) => {
        const parsed = radarSchema.parse(json);
        setConfig(parsed);
      })
      .catch((fetchError) => setError(fetchError.message));
  }, []);

  const entries = useMemo(() => {
    if (!config) return [];
    return filterEntries(config.entries, filters, config);
  }, [config, filters]);

  const handleExport = () => {
    if (!config) return;
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'radar-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <div className="p-8 text-red-600">Failed to load radar: {error}</div>;
  if (!config) return <div className="p-8">Loading radar...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{config.title}</h1>
            <p className="text-sm text-slate-600">Updated {config.updatedAt}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border px-4 py-2" onClick={() => setView('radar')}>
              Radar
            </button>
            <button className="rounded-lg border px-4 py-2" onClick={() => setView('list')}>
              List
            </button>
            <button className="rounded-lg bg-slate-800 px-4 py-2 text-white" onClick={handleExport}>
              Export JSON
            </button>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <FiltersPanel config={config} filters={filters} onFiltersChange={setFilters} />
          {view === 'radar' ? (
            <RadarChart config={config} entries={entries} onSelect={setSelected} />
          ) : (
            <EntriesList entries={entries} config={config} onSelect={setSelected} />
          )}
        </div>
      </div>

      <EntryDrawer
        entry={selected}
        quadrant={config.quadrants.find((quadrant) => quadrant.id === selected?.quadrantId)}
        ring={config.rings.find((ring) => ring.id === selected?.ringId)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default App;
