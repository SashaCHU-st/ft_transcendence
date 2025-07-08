import { z } from 'zod';

export const BlockSchema = z.object({
  blockedId: z.number().int().positive(),
});
