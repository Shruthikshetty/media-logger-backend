/**
 * this @file contains the validation schema for delete user
 */

import z from 'zod';
import { ObjectId } from 'mongodb';

// schema
export const DeleteUserZodSchema = z.object({
  id: z.string({ required_error: 'User id is required' }).refine(
    (id) => {
      return ObjectId.isValid(id);
    },
    { message: 'Invalid user id' }
  ),
});

// export the type
export type DeleteUserZodSchemaType = z.infer<typeof DeleteUserZodSchema>;
