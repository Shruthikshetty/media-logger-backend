/**
 * @file contains the validation schema for updating media entry
 */

import { z } from 'zod';
import { MEDIA_ENTRY_STATUS } from '../../constants/model.constants';

//schema
export const UpdateMediaEntrySchema = z
  .object({
    status: z
      .string({
        message: 'Status must be string',
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
  })
  .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be updated',
        path: [],
      });
    }
  });

//export type
export type UpdateMediaEntrySchemaType = z.infer<typeof UpdateMediaEntrySchema>;
