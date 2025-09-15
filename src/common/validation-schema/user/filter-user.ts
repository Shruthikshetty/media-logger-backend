/**
 * This @file contains the validation schema for filtering users
 */

import z from 'zod';
import { USER_ROLES } from '../../constants/model.constants';

//schema
export const FilterUserZodSchema = z.object({
  role: z
    .string({
      message: 'Role must be string',
    })
    .refine((val) => USER_ROLES.includes(val), {
      message: `Role must be one of the following: ${USER_ROLES.join(', ')}`,
    })
    .optional(),
  searchText: z
    .string({
      message: 'Search text must be string',
    })
    .optional(),
});

//export type
export type FilterUserZodType = z.infer<typeof FilterUserZodSchema>;
