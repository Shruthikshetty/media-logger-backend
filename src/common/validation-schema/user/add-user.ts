/**
 * @file holds the add user validation schema and type
 */

import z from 'zod';
import { Regex } from '../../constants/patterns.constants';

//schema const for add user
export const AddUserZodSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      message: 'Name must be string',
    })
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),

  password: z.string({
    required_error: 'Password is required',
    message: 'Password must be string',
  }),

  email: z
    .string({ required_error: 'Email is required' })
    .regex(Regex.email, 'Email is not valid'),

  bio: z
    .string({ message: 'Bio must be string' })
    .max(200, 'Bio can be at most 200 characters')
    .optional()
    .default(''),

  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(50, 'Location must be at most 50 characters')
    .optional(),

  profileImg: z.string().optional().default(''),

  xp: z.number().optional().default(0),
});

export type AddUserZodSchemaType = z.infer<typeof AddUserZodSchema>;
