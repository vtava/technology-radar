import { describe, expect, it } from 'vitest';
import radarData from '../../public/data/radar.json';
import { radarSchema } from './schema';

describe('radar schema', () => {
  it('validates sample data', () => {
    const result = radarSchema.safeParse(radarData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid ring reference', () => {
    const copy = structuredClone(radarData);
    copy.entries[0].ringId = 'missing';

    const result = radarSchema.safeParse(copy);
    expect(result.success).toBe(false);
  });
});
