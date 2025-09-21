/**
 * This @file contains the validation schema for filtering users
 */

import { z } from 'zod';
import { USER_ROLES } from '../../constants/model.constants';
import { GET_ALL_USER_LIMITS } from '../../constants/config.constants';

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
  limit: z
    .number({
      message: 'Limit must be number',
    })
    .int()
    .max(GET_ALL_USER_LIMITS.limit.max)
    .min(GET_ALL_USER_LIMITS.limit.min)
    .default(GET_ALL_USER_LIMITS.limit.default),

  page: z
    .number({
      message: 'Page must be number',
    })
    .int()
    .min(1)
    .default(1),
});

//export type
export type FilterUserZodType = z.infer<typeof FilterUserZodSchema>;
