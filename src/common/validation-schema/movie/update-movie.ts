/**
 * @file contains the validation schema for update movie
 */

import z from 'zod';
import { AddMovieZodSchema } from './add-movie';

export const updateMoveZodSchema = AddMovieZodSchema.partial().superRefine(
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
export type UpdateMovieZodSchemaType = z.infer<typeof updateMoveZodSchema>;
