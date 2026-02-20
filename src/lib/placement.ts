import type { RadarConfig } from '../types/radar';

export type PositionedEntry = {
  id: string;
  x: number;
  y: number;
};

const seededRandom = (seed: number) => {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
};

export const getPositionedEntries = (
  config: RadarConfig,
  width: number,
  height: number
): Record<string, PositionedEntry> => {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  const sortedRings = [...config.rings].sort((a, b) => a.order - b.order);

  const positions: Record<string, PositionedEntry> = {};
  const occupied: Array<{ x: number; y: number }> = [];

  config.entries.forEach((entry, index) => {
    const ringIndex = sortedRings.findIndex((ring) => ring.id === entry.ringId);
    const quadrantIndex = config.quadrants.findIndex(
      (quadrant) => quadrant.id === entry.quadrantId
    );

    const innerRadius = (ringIndex / sortedRings.length) * maxRadius;
    const outerRadius = ((ringIndex + 1) / sortedRings.length) * maxRadius;

    const startAngle = -Math.PI + quadrantIndex * (Math.PI / 2);
    const endAngle = startAngle + Math.PI / 2;

    const random = seededRandom(index + 33);
    let attempt = 0;
    let x = centerX;
    let y = centerY;

    while (attempt < 120) {
      const radius = innerRadius + (outerRadius - innerRadius) * (0.1 + 0.9 * random());
      const angle = startAngle + (endAngle - startAngle) * random();

      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;

      const overlaps = occupied.some((point) => {
        const dx = point.x - x;
        const dy = point.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 26;
      });

      if (!overlaps) {
        break;
      }

      attempt += 1;
    }

    occupied.push({ x, y });
    positions[entry.id] = { id: entry.id, x, y };
  });

  return positions;
};
