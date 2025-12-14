/**
 * @file contains the validation schema used in getting user media entries
 */

import { z } from 'zod';
import {
  MEDIA_ENTRY_MODELS,
  MEDIA_ENTRY_STATUS,
} from '../../constants/model.constants';

//schema (this only contains optional fields )
export const GetAllUserMediaEntrySchema = z.object({
  onModel: z
    .string()
    .refine((val) => MEDIA_ENTRY_MODELS.includes(val))
    .optional(),

  status: z
    .string()
    .refine((val) => MEDIA_ENTRY_STATUS.includes(val))
    .optional(),
});

//type
export type GetAllUserMediaEntrySchemaType = z.infer<
  typeof GetAllUserMediaEntrySchema
>;
