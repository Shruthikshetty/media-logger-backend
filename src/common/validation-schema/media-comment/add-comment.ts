/**
 * @file contains the validation schema for adding media comments
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';
import { HISTORY_ENTITY } from '../../constants/model.constants';

//schema
export const AddMediaCommentSchema = z.object({
  entityId: z
    .string({
      required_error: 'Entity id is required',
      invalid_type_error: 'Entity id must be string',
    })
    .refine((val) => isMongoIdValid(val), {
      message: 'Invalid entity id',
    }),

  entityType: z
    .string({
      required_error: 'Entity type is required',
      invalid_type_error: 'Entity type must be string',
    })
    .refine((val) => HISTORY_ENTITY.includes(val), {
      message: `Entity type must be one of the following: ${HISTORY_ENTITY.join(', ')}`,
    }),

  comment: z.string({
    required_error: 'Comment is required',
    invalid_type_error: 'Comment must be string',
  }),
});

//export the type
export type AddMediaCommentSchemaType = z.infer<typeof AddMediaCommentSchema>;
