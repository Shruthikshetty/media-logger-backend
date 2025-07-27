/**
 * @file contains the zod validation schema for bulk delete games
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';

//schema
export const BulkDeleteGameZodSchema = z.object({
  gameIds: z
    .array(
      z
        .string({
          required_error: 'Game ids are required',
          message: 'Game ids must be string',
        })
        .refine((value) => isMongoIdValid(value), {
          message: 'Invalid game id',
        })
    )
    .min(1, 'At least one game id is required'),
});

// export the type
export type BulkDeleteGameZodType = z.infer<typeof BulkDeleteGameZodSchema>;
