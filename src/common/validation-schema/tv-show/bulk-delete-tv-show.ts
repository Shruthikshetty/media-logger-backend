/**
 * this @file contains the validation schema for bulk delete tv shows
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';

//schema
export const BulkDeleteTvShowZodSchema = z.object({
  tvShowIds: z
    .array(
      z
        .string({ message: 'Tv show id must be string' })
        .refine((val) => isMongoIdValid(val), { message: 'Invalid tv show id' })
    )
    .min(1, 'At least one tv show id is required'),
});

//export the type
export type BulkDeleteTvShowZodSchemaType = z.infer<
  typeof BulkDeleteTvShowZodSchema
>;
