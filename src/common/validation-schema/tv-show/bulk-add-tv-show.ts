/**
 * @file holds the bulk add tv show validation schema
 */

import z from 'zod';
import { AddTvShowZodSchema } from './add-tv-show';

//schema
export const BulkAddTvShowZodSchema = z
  .array(AddTvShowZodSchema, {
    message: 'details must be an array of tv show objects',
  })
  .min(1, 'At least one tv show is required');

// export the type
export type BulkAddTvShowZodSchemaType = z.infer<typeof BulkAddTvShowZodSchema>;
