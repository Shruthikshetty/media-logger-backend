/**
 * @file This file contains the validation schema for updating a TV show
 */

import z from 'zod';
import { AddTvShowZodSchema } from './add-tv-show';

//schema
export const UpdateTvShowZodSchema = AddTvShowZodSchema.omit({ seasons: true })
  .partial()
  .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be updated',
        path: [],
      });
    }
  });

// export the type
export type UpdateTvShowZodType = z.infer<typeof UpdateTvShowZodSchema>;
