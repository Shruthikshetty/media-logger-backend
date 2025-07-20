/**
 * @file holds the add bulk movie validation schema
 */

import z from 'zod';
import { AddMovieZodSchema } from './add-movie';

//schema
export const BulkAddMovieZodSchema = AddMovieZodSchema.array().min(
  1,
  'At least one movie is required'
);

// export the type
export type BulkAddMovieZodSchemaType = z.infer<typeof BulkAddMovieZodSchema>;
