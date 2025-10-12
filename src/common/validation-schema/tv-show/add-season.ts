/**
 * @file contains zod schema for add a season to a tv-show
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';
import { SEASON_STATUS } from '../../constants/model.constants';
import { AddEpisodeZodSchema } from './add-episode';

// schema
export const AddSeasonZodSchema = z.object({
  tvShow: z
    .string({
      required_error: 'Tv show id is required',
      message: 'Tv show id must be string',
    })
    .refine((val) => isMongoIdValid(val), { message: 'Invalid tv show id' }),

  seasonNumber: z.number({
    required_error: 'Season number is required',
    message: 'Season number must be number',
  }),

  title: z.string({
    required_error: 'Title is required',
    message: 'Title must be string',
  }),

  description: z
    .string({
      message: 'Description must be string',
    })
    .optional(),

  releaseDate: z
    .string({
      message: 'Release date must be  iso date string',
    })
    .datetime({ message: 'Release date must be in iso format' })
    .transform((val) => new Date(val))
    .optional(),

  noOfEpisodes: z.number({
    required_error: 'No of episodes is required',
    message: 'No of episodes must be number',
  }),

  posterUrl: z
    .string({
      message: 'Poster url must be string',
    })
    .optional(),

  seasonRating: z
    .number({
      message: 'Season rating must be number',
    })
    .optional(),

  status: z
    .string({
      required_error: 'Status is required',
      message: 'Status must be string',
    })
    .refine((val) => SEASON_STATUS.includes(val), {
      message: `Status must be one of the following: ${SEASON_STATUS.join(', ')}`,
    }),

  youtubeVideoId: z
    .string({
      message: 'Youtube id must be string',
    })
    .optional(),

  averageRating: z
    .number({
      message: 'Average rating must be a number',
    })
    .min(0, { message: 'Rating cannot be negative' })
    .max(10, { message: 'Rating cannot be greater than 10' })
    .optional(),

  episodes: z.array(AddEpisodeZodSchema.omit({ season: true })).optional(),
});

// export the type
export type AddSeasonZodType = z.infer<typeof AddSeasonZodSchema>;
