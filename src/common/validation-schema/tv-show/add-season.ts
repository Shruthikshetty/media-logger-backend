/**
 * @file contains zod schema for add a season to a tv-show
 */

import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';
import { SEASON_STATUS } from '../../constants/model.constants';

// schema
export const AddSeasonZodSchema = z.object({
  tvShow: z
    .string({
      required_error: 'Tv show id is required',
      message: 'Tv show id must be string',
    })
    .refine(
      (val) => {
        isMongoIdValid(val);
      },
      { message: 'Invalid tv show id' }
    ),

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

  releaseDate: z.string({
    required_error: 'Release date is required',
    message: 'Release date must be string',
  }),

  noOfEpisodes: z.number({
    required_error: 'No of episodes is required',
    message: 'No of episodes must be number',
  }),

  posterUrl: z
    .string({
      message: 'Poster url must be string',
    })
    .optional(),

  seasonRating: z.number({
    required_error: 'Season rating is required',
    message: 'Season rating must be number',
  }),

  status: z
    .string({
      required_error: 'Status is required',
      message: 'Status must be string',
    })
    .refine((val) => SEASON_STATUS.includes(val), {
      message: `Status must be one of the following: ${SEASON_STATUS.join(', ')}`,
    }),
    
  trailerYoutubeUrl: z
    .string({
      message: 'Trailer youtube url must be string',
    })
    .optional(),
});

// export the type
export type AddSeasonZodType = z.infer<typeof AddSeasonZodSchema>;
