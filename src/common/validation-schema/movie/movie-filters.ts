/**
 * This file contains the validation schema for movie filters
 */

import z from 'zod';
import { GET_ALL_MOVIES_LIMITS } from '../../constants/config.constants';
import { omit } from 'lodash';

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

    releaseDate: z
      .object({
        lte: z
          .string({
            message: 'Release date lte must be string',
          })
          .datetime({
            message:
              'Release date lte must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          })
          .transform((val) => new Date(val))
          .optional(),
        gte: z
          .string({
            message: 'Release date gte must be string',
          })
          .datetime({
            message:
              'Release date gte must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          })
          .transform((val) => new Date(val))
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Release date must include at least one of gte or lte',
      })
      .optional(),

    runTime: z
      .object({
        gte: z
          .number({
            message: 'Run time gte must be number',
          })
          .min(0)
          .optional(),
        lte: z
          .number({
            message: 'Run time lte must be number',
          })
          .min(0)
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Run time must include at least one of gte or lte',
      })
      .optional(),

    languages: z
      .string({
        message: 'Languages must be string',
      })
      .transform((val) => val.toLowerCase())
      .optional(),

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
      .object({
        gte: z
          .number({
            message: 'Age rating gte must be number',
          })
          .min(0)
          .optional(),
        lte: z
          .number({
            message: 'Age rating lte must be number',
          })
          .min(0)
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Age rating must include at least one of gte or lte',
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
    const hasValue = Object.values(omit(data, 'limit', 'start', 'page')).some(
      (val) => val !== undefined
    );
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
