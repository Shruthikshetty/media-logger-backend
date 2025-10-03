/**
 * @file This file contains the validation schema for filtering TV shows
 */
import z from 'zod';
import { GET_ALL_TV_SHOW_LIMITS } from '../../constants/config.constants';

//@TODO handle lte > gte
//schema
export const FilterTvShowZodSchema = z.object({
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

  totalEpisodes: z
    .object({
      gte: z
        .number({
          message: 'Total episodes gte must be number',
        })
        .min(0)
        .optional(),
      lte: z
        .number({
          message: 'Total episodes lte must be number',
        })
        .min(0)
        .optional(),
    })
    .refine((data) => data.gte !== undefined || data.lte !== undefined, {
      message: 'Total episodes must include at least one of gte or lte',
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

  status: z
    .string({
      required_error: 'Status is required',
      message: 'Status must be string',
    })
    .optional(),

  languages: z
    .array(
      z
        .string({
          message: 'Languages must be string',
        })
        .transform((val) => val.toLowerCase()),
      {
        message: 'Languages must be an array of strings',
      }
    )
    .refine((data) => data.length > 0, {
      message: 'Languages must be an array of strings with at least one value',
    })
    .optional(),

  tags: z
    .array(z.string({ message: 'Tags must be string' }), {
      message: 'Tags must be an array of strings',
    })
    .optional(),

  totalSeasons: z
    .object({
      gte: z
        .number({
          message: 'Total seasons gte must be number',
        })
        .min(0)
        .optional(),
      lte: z
        .number({
          message: 'Total seasons lte must be number',
        })
        .min(0)
        .optional(),
    })
    .refine((data) => data.gte !== undefined || data.lte !== undefined, {
      message: 'Total seasons must include at least one of gte or lte',
    })
    .optional(),

  limit: z
    .number({
      message: 'Limit must be number',
    })
    .max(GET_ALL_TV_SHOW_LIMITS.limit.max)
    .min(GET_ALL_TV_SHOW_LIMITS.limit.min)
    .default(GET_ALL_TV_SHOW_LIMITS.limit.default),

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
});

// export the type
export type FilterTvShowZodType = z.infer<typeof FilterTvShowZodSchema>;
