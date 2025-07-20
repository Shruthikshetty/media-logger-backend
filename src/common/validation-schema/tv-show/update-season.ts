/**
 * @file contains all the validation schema for updating a season
 */

import z from 'zod';
import { AddSeasonZodSchema } from './add-season';

//schema
export const UpdateSeasonZodSchema = AddSeasonZodSchema.omit({ episodes: true })
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
export type UpdateSeasonZodType = z.infer<typeof UpdateSeasonZodSchema>;
