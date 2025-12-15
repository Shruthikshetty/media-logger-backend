/**
 * @file contains the validation schema used in getting user media entries
 */

import { z } from 'zod';
import {
  MEDIA_ENTRY_MODELS,
  MEDIA_ENTRY_STATUS,
} from '../../constants/model.constants';
import { isMongoIdValid } from '../../utils/mongo-errors';

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

//schema to get a single media by using the model and media id
export const GetSingleMediaByIdSchema = z.object({
  mediaItem: z.string().refine((val) => isMongoIdValid(val)),

  onModel: z
    .string()
    .refine((val) => MEDIA_ENTRY_MODELS.includes(val))
    .optional(),
});

//type
export type GetSingleMediaByIdSchemaType = z.infer<typeof GetSingleMediaByIdSchema>;
