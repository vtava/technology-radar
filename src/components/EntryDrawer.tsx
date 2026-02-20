import type { RadarEntry, RadarQuadrant, RadarRing } from '../types/radar';

type Props = {
  entry: RadarEntry | null;
  quadrant?: RadarQuadrant;
  ring?: RadarRing;
  onClose: () => void;
};

export const EntryDrawer = ({ entry, quadrant, ring, onClose }: Props) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="mb-3 rounded bg-slate-100 px-3 py-1 text-sm">
          Close
        </button>
        <h2 className="text-2xl font-semibold">{entry.name}</h2>
        <p className="mt-3 text-slate-700">{entry.description}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="font-semibold">Quadrant</dt><dd>{quadrant?.label}</dd></div>
          <div><dt className="font-semibold">Ring</dt><dd>{ring?.label}</dd></div>
          <div><dt className="font-semibold">Owner</dt><dd>{entry.owner}</dd></div>
          <div><dt className="font-semibold">Last Updated</dt><dd>{entry.lastUpdated}</dd></div>
          <div><dt className="font-semibold">Tags</dt><dd>{entry.tags.join(', ')}</dd></div>
          {(entry.maturity || entry.status) && <div><dt className="font-semibold">Maturity</dt><dd>{entry.maturity ?? entry.status}</dd></div>}
        </dl>
        <ul className="mt-4 space-y-1">
          {entry.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};
