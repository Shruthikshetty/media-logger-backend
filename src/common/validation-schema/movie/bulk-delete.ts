/**
 * this @file contains the validation schema for bulk delete movies
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';

//schema
export const BulkDeleteMovieZodSchema = z.object({
  movieIds: z
    .array(
      z
        .string({ required_error: 'Movie ids are required' })
        .refine((val) => isMongoIdValid(val), { message: 'Invalid movie id' })
    )
    .min(1, 'At least one movie id is required'),
});

// export the type
export type BulkDeleteMovieZodSchemaType = z.infer<
  typeof BulkDeleteMovieZodSchema
>;
