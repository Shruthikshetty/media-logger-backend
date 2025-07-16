/**
 * this @file contains the validation schema for update user
 */

import z from 'zod';
import { Regex } from '../../constants/patterns.constants';

//schema
export const UpdateUserZodSchema = z
  .object({
    name: z
      .string({
        message: 'Name must be string',
      })
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters')
      .optional(),

    password: z
      .string({
        message: 'Password must be string',
      })
      .optional(),

    bio: z
      .string({
        message: 'Bio must be string',
      })
      .max(200, 'Bio can be at most 200 characters')
      .optional(),

    location: z
      .string()
      .min(3, 'Location must be at least 3 characters')
      .max(50, 'Location must be at most 50 characters')
      .optional(),

    email: z.string().regex(Regex.email, 'Email is not valid').optional(),

    xp: z.number().optional(),

    profileImg: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    console.log(hasValue);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided',
        path: [], // attaches to the root object
      });
    }
  });

//export type
export type UpdateUserZodSchemaType = z.infer<typeof UpdateUserZodSchema>;


