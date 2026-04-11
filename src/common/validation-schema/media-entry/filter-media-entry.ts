/**
 * @file contains the validation schema used in filtering user media entries
 */

import { z } from 'zod';
import {
  MEDIA_ENTRY_MODELS,
  MEDIA_ENTRY_STATUS,
} from '../../constants/model.constants';
import { MEDIA_ENTRY_SORT_FILTERS } from '../../constants/config.constants';

//schema
export const FilterMediaEntrySchema = z
  .object({
    onModel: z
      .string({
        invalid_type_error: 'On model must be string',
      })
      .refine((val) => MEDIA_ENTRY_MODELS.includes(val), {
        message: `On model must be one of the following: ${MEDIA_ENTRY_MODELS.join(
          ', '
        )}`,
      })
      .optional(),

    status: z
      .string({
        invalid_type_error: 'Status must be string',
      })
      .refine((val) => MEDIA_ENTRY_STATUS.includes(val), {
        message: `Status must be one of the following: ${MEDIA_ENTRY_STATUS.join(
          ', '
        )}`,
      })
      .optional(),

    rating: z
      .number({
        message: 'Rating must be number',
      })
      .min(0, 'Rating cannot be negative')
      .max(10, 'Rating cannot be greater than 10')
      .optional(),

    sortBy: z
      .string({
        invalid_type_error: 'Sort by must be string',
      })
      .refine((val) => MEDIA_ENTRY_SORT_FILTERS.includes(val), {
        message: `Sort by must be one of the following: ${MEDIA_ENTRY_SORT_FILTERS.join(
          ', '
        )}`,
      })
      .default('createdAt'),

    sortOrder: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'Sort order must be asc or desc' }),
      })
      .optional()
      .default('desc'),

    limit: z
      .number({
        message: 'Limit must be number',
      })
      .min(1)
      .optional(),

    page: z
      .number({
        message: 'Page must be number',
      })
      .min(1)
      .default(1),
  })
  .default({});

//export type
export type FilterMediaEntrySchemaType = z.infer<typeof FilterMediaEntrySchema>;
