/**
 * @file contains schema for updating a media comment
 */
import z from 'zod';

//schema
export const UpdateMediaCommentSchema = z.object({
  comment: z
    .string({
      required_error: 'Comment is required',
      invalid_type_error: 'Comment must be string',
    })
    .trim()
    .min(1, { message: 'Comment cannot be empty' })
    .max(5000, { message: 'Comment must be 5000 characters or less' }),
});

// export type
export type UpdateMediaCommentSchemaType = z.infer<
  typeof UpdateMediaCommentSchema
>;
