/**
 * @file contains the validation schema for updating an episode
 */

import z from 'zod';
import { AddEpisodeZodSchema } from './add-episode';

//schema
export const UpdateEpisodeZodSchema = AddEpisodeZodSchema.partial().superRefine(
  (data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be updated',
        path: [],
      });
    }
  }
);

// export the type
export type UpdateEpisodeZodType = z.infer<typeof UpdateEpisodeZodSchema>;
