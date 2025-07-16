/**
 * @file contains the validation schema for updating user role
 */

import z from 'zod';
import { USER_ROLES } from '../../constants/model.constants';

//schema
export const UpdateRoleZodSchema = z.object({
  role: z
    .string({
      required_error: 'Role is required',
      message: 'Role must be string',
    })
    .refine((val) => USER_ROLES.includes(val), {
      message: `Role must be one of the following: ${USER_ROLES.join(', ')}`,
    }),
});

// export the type
export type UpdateRoleZodSchemaType = z.infer<typeof UpdateRoleZodSchema>;