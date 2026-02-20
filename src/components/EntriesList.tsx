import type { RadarConfig, RadarEntry } from '../types/radar';

type Props = {
  entries: RadarEntry[];
  config: RadarConfig;
  onSelect: (entry: RadarEntry) => void;
};

export const EntriesList = ({ entries, config, onSelect }: Props) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-100 text-slate-700">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Quadrant</th>
          <th className="p-3">Ring</th>
          <th className="p-3">Owner</th>
          <th className="p-3">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id} className="border-t border-slate-100 hover:bg-slate-50" onClick={() => onSelect(entry)}>
            <td className="p-3 font-medium text-blue-700">{entry.name}</td>
            <td className="p-3">{config.quadrants.find((item) => item.id === entry.quadrantId)?.label}</td>
            <td className="p-3">{config.rings.find((item) => item.id === entry.ringId)?.label}</td>
            <td className="p-3">{entry.owner}</td>
            <td className="p-3">{entry.lastUpdated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
