/**
 * This file contains the validation schema for movie filters
 */

import z from 'zod';
import { GET_ALL_MOVIES_LIMITS } from '../../constants/config.constants';

export const MovieFiltersZodSchema = z
  .object({
    averageRating: z
      .number({
        message: 'Average rating must be number',
      })
      .optional(),

    genre: z
      .array(z.string({ message: 'Genre must be string' }), {
        message: 'Genre must be an array of strings',
      })
      .optional(),

    fromReleaseDate: z
      .string({
        message: 'From release date must be string',
      })
      .datetime({
        message:
          'From release date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
      })
      .optional(),

    toReleaseDate: z
      .string({
        message: 'To release date must be string',
      })
      .datetime({
        message:
          'To release date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
      })
      .optional(),

    runTime: z
      .number({
        message: 'Run time must be number',
      })
      .optional(),

    languages: z
      .string({
        message: 'Languages must be string',
      })
      .transform((val) => val.toLocaleLowerCase()),

    tags: z
      .array(z.string({ message: 'Tags must be string' }), {
        message: 'Tags must be an array of strings',
      })
      .optional(),

    status: z
      .string({
        required_error: 'Status is required',
        message: 'Status must be string',
      })
      .optional(),

    ageRating: z
      .number({
        message: 'Age rating must be number',
      })
      .optional(),

    limit: z
      .number({
        message: 'Limit must be number',
      })
      .max(GET_ALL_MOVIES_LIMITS.limit.max)
      .min(GET_ALL_MOVIES_LIMITS.limit.min)
      .default(GET_ALL_MOVIES_LIMITS.limit.default),

    page: z
      .number({
        message: 'Page must be number',
      })
      .min(1)
      .default(1),
  })
  .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide filter for results to appear',
        path: [],
      });
    }
  });

//export type
export type MovieFiltersZodType = z.infer<typeof MovieFiltersZodSchema>;
