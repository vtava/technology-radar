import clsx from 'clsx';
import { useMemo } from 'react';
import type { RadarConfig, RadarEntry } from '../types/radar';
import { getPositionedEntries } from '../lib/placement';

type Props = {
  config: RadarConfig;
  entries: RadarEntry[];
  onSelect: (entry: RadarEntry) => void;
};

type Point = { x: number; y: number };

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number): Point => ({
  x: cx + Math.cos(angle) * radius,
  y: cy + Math.sin(angle) * radius
});

const describeSector = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ');
};

const quadrantBaseColors = ['34 197 94', '59 130 246', '168 85 247', '249 115 22'];

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
        {config.quadrants.map((quadrant, quadrantIndex) => {
          const startAngle = -Math.PI + quadrantIndex * (Math.PI / 2);
          const endAngle = startAngle + Math.PI / 2;
          const baseColor = quadrantBaseColors[quadrantIndex % quadrantBaseColors.length];

          return sortedRings.map((ring, ringIndex) => {
            const innerRadius = (ringIndex / sortedRings.length) * radius;
            const outerRadius = ((ringIndex + 1) / sortedRings.length) * radius;
            const intensity = (sortedRings.length - ringIndex) / sortedRings.length;
            const alpha = 0.12 + intensity * 0.2;

            return (
              <path
                key={`${quadrant.id}-${ring.id}`}
                d={describeSector(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle)}
                fill={`rgb(${baseColor} / ${alpha})`}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          });
        })}

        {sortedRings.map((ring, index) => {
          const normalized = (index + 1) / sortedRings.length;
          return (
            <g key={ring.id}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * normalized}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <text
                x={centerX + 12}
                y={centerY - radius * normalized + 18}
                className="fill-slate-700 text-[13px] font-medium"
              >
                {ring.label}
              </text>
            </g>
          );
        })}

        <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="#94a3b8" />
        <line x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="#94a3b8" />

        {config.quadrants.map((quadrant, index) => {
          const startAngle = -Math.PI + index * (Math.PI / 2);
          const endAngle = startAngle + Math.PI / 2;
          const angle = startAngle + (endAngle - startAngle) / 2;
          const labelPoint = polarToCartesian(centerX, centerY, radius + 32, angle);
          const textAnchor =
            Math.cos(angle) > 0.25 ? 'start' : Math.cos(angle) < -0.25 ? 'end' : 'middle';

          return (
            <text
              key={quadrant.id}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="fill-slate-800 text-[15px] font-semibold"
            >
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
