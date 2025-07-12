/**
 * @file contains the zod validation schema from user login
 */

import z from 'zod';
import { Regex } from '../../constants/patterns.constants';

export const LoginZodSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      message: 'Email must be string',
    })
    .regex(Regex.email, 'Email is not valid'),

  password: z.string({
    required_error: 'Password is required',
    message: 'Password must be string',
  }),
});

// export the type
export type LoginZodSchemaType = z.infer<typeof LoginZodSchema>;
