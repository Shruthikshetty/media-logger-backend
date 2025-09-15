/**
 * @file contains the validation schema for game filters
 */

import z from 'zod';
import { GET_ALL_GAMES_LIMITS } from '../../constants/config.constants';

//schema
export const GamesFilterZodSchema = z
  .object({
    averageRating: z
      .number({
        message: 'Average rating must be number',
      })
      .min(0, {
        message: 'Average rating must be greater than or equal to 0',
      })
      .max(10, {
        message: 'Average rating must be less than or equal to 10',
      })
      .optional(),

    genre: z
      .array(z.string({ message: 'Genre must be string' }), {
        message: 'Genre must be an array of strings',
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

    status: z
      .string({
        required_error: 'Status is required',
        message: 'Status must be string',
      })
      .optional(),

    platforms: z
      .array(z.string({ message: 'Platforms must be string' }), {
        message: 'Platforms must be an array of strings',
      })
      .optional(),

    avgPlaytime: z
      .object({
        gte: z
          .number({
            message: 'Average playtime gte must be number',
          })
          .min(0)
          .optional(),
        lte: z
          .number({
            message: 'Average playtime lte must be number',
          })
          .min(0)
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Average playtime must include at least one of gte or lte',
      })
      .optional(),

    limit: z
      .number({
        message: 'Limit must be number',
      })
      .max(GET_ALL_GAMES_LIMITS.limit.max)
      .min(GET_ALL_GAMES_LIMITS.limit.min)
      .default(GET_ALL_GAMES_LIMITS.limit.default),

    page: z
      .number({
        message: 'Page must be number',
      })
      .min(1)
      .default(1),
    searchText: z
      .string({
        message: 'Search text must be string',
      })
      .optional(),
  })

//export type
export type GamesFilterZodSchemaType = z.infer<typeof GamesFilterZodSchema>;
