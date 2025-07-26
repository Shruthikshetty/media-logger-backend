/**
 * @file contains the zod validation schema for bulk addition of games
 */

import z from 'zod';
import { AddGameZodSchema } from './add-game';

//schema
export const BulkAddGameZodSchema = z
  .array(AddGameZodSchema, {
    message: 'Games must be an array of game objects',
  })
  .min(1, 'At least one game is required');

// export the type
export type BulkAddGameZodSchemaType = z.infer<typeof BulkAddGameZodSchema>;
