import clsx from 'clsx';
import { useMemo } from 'react';
import type { RadarConfig, RadarEntry } from '../types/radar';
import { getPositionedEntries } from '../lib/placement';

type Props = {
  config: RadarConfig;
  entries: RadarEntry[];
  onSelect: (entry: RadarEntry) => void;
};

export const RadarChart = ({ config, entries, onSelect }: Props) => {
  const width = 860;
  const height = 860;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 380;
  const sortedRings = [...config.rings].sort((a, b) => a.order - b.order);

  const positionMap = useMemo(
    () => getPositionedEntries({ ...config, entries }, width, height),
    [config, entries]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {[...sortedRings].reverse().map((ring, index) => {
          const normalized = (sortedRings.length - index) / sortedRings.length;
          return (
            <g key={ring.id}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * normalized}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
              />
              <text x={centerX + 8} y={centerY - radius * normalized + 16} className="fill-slate-500 text-[13px]">
                {ring.label}
              </text>
            </g>
          );
        })}

        <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="#d1d5db" />
        <line x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="#d1d5db" />

        {config.quadrants.map((quadrant, index) => {
          const positions = [
            { x: centerX - radius + 10, y: centerY - radius + 20 },
            { x: centerX + 20, y: centerY - radius + 20 },
            { x: centerX - radius + 10, y: centerY + radius - 10 },
            { x: centerX + 20, y: centerY + radius - 10 }
          ];
          return (
            <text key={quadrant.id} x={positions[index].x} y={positions[index].y} className="fill-slate-700 text-[14px] font-semibold">
              {quadrant.label}
            </text>
          );
        })}

        {entries.map((entry) => {
          const point = positionMap[entry.id];
          const ring = config.rings.find((item) => item.id === entry.ringId);

          return (
            <g key={entry.id} className="cursor-pointer" onClick={() => onSelect(entry)}>
              <circle
                cx={point.x}
                cy={point.y}
                r={8}
                className={clsx('transition', ring?.color ?? 'fill-blue-500', 'hover:opacity-80')}
              >
                <title>
                  {entry.name} | {entry.description} | {entry.tags.join(', ')}
                </title>
              </circle>
              <text x={point.x + 10} y={point.y + 4} className="fill-slate-800 text-[11px]">
                {entry.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
