import { z } from 'zod';

export const ringSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  order: z.number().int().positive(),
  color: z.string().optional()
});

export const quadrantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1)
});

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const entrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quadrantId: z.string().min(1),
  ringId: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  owner: z.string().min(1),
  lastUpdated: z.string().date(),
  links: z.array(linkSchema),
  maturity: z.string().optional(),
  status: z.string().optional()
});

export const radarSchema = z
  .object({
    title: z.string().min(1),
    updatedAt: z.string().date(),
    rings: z.array(ringSchema).length(4),
    quadrants: z.array(quadrantSchema).length(4),
    entries: z.array(entrySchema).min(1)
  })
  .superRefine((data, ctx) => {
    const ringIds = new Set(data.rings.map((ring) => ring.id));
    const quadrantIds = new Set(data.quadrants.map((quadrant) => quadrant.id));

    for (const entry of data.entries) {
      if (!ringIds.has(entry.ringId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Entry ${entry.id} references unknown ringId`,
          path: ['entries', entry.id, 'ringId']
        });
      }
      if (!quadrantIds.has(entry.quadrantId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Entry ${entry.id} references unknown quadrantId`,
          path: ['entries', entry.id, 'quadrantId']
        });
      }
    }
  });

export type RadarSchema = z.infer<typeof radarSchema>;
