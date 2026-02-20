import { describe, expect, it } from 'vitest';
import data from '../../public/data/radar.json';
import { getPositionedEntries } from './placement';

describe('placement', () => {
  it('returns deterministic positions in bounds', () => {
    const positions = getPositionedEntries(data, 860, 860);
    expect(Object.keys(positions)).toHaveLength(data.entries.length);

    for (const pos of Object.values(positions)) {
      expect(pos.x).toBeGreaterThan(0);
      expect(pos.y).toBeGreaterThan(0);
      expect(pos.x).toBeLessThan(860);
      expect(pos.y).toBeLessThan(860);
    }
  });
});
