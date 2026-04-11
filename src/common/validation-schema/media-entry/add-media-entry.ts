/**
 * @file contains the validation schema for adding a media entry
 */
import { z } from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';
import {
  MEDIA_ENTRY_MODELS,
  MEDIA_ENTRY_STATUS,
} from '../../constants/model.constants';

//schema
export const AddMediaEntrySchema = z.object({
  mediaItem: z
    .string({
      required_error: 'Media item is required',
      invalid_type_error: 'Media item must be string',
    })
    .refine((val) => isMongoIdValid(val), {
      message: 'Invalid media item id',
    }),

  onModel: z
    .string({
      required_error: 'On model is required',
      invalid_type_error: 'On model must be string',
    })
    .refine((val) => MEDIA_ENTRY_MODELS.includes(val), {
      message: `On model must be one of the following: ${MEDIA_ENTRY_MODELS.join(
        ', '
      )}`,
    }),

  status: z
    .string({
      required_error: 'Status is required',
      invalid_type_error: 'Status must be string',
    })
    .refine((val) => MEDIA_ENTRY_STATUS.includes(val), {
      message: `Status must be one of the following: ${MEDIA_ENTRY_STATUS.join(
        ', '
      )}`,
    }),
  rating: z
    .number({
      message: 'Rating must be number',
    })
    .min(0, 'Rating cannot be negative')
    .max(10, 'Rating cannot be greater than 10')
    .optional(),
});

// export the type
export type AddMediaEntryZodSchemaType = z.infer<typeof AddMediaEntrySchema>;
