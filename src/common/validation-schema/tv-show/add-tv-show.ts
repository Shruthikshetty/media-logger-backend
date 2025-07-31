/**
 * @file contains zod schema for adding a tv-show
 */

import z from 'zod';
import {
  GENRE_MOVIE_TV,
  MEDIA_STATUS,
  TAGS,
} from '../../constants/model.constants';
import { AddSeasonZodSchema } from './add-season';

//schema
export const AddTvShowZodSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    message: 'Title must be string',
  }),

  description: z.string({
    required_error: 'Description is required',
    message: 'Description must be string',
  }),

  averageRating: z
    .number({
      message: 'Average rating must be number',
    })
    .max(10, 'Average rating can be at most 10')
    .optional(),
  genre: z.array(
    z
      .string({
        message: 'Genre must be string',
      })
      .refine(
        (val) => {
          return GENRE_MOVIE_TV.includes(val);
        },
        {
          message: `Genre must be one of the following: ${GENRE_MOVIE_TV.join(', ')}`,
        }
      ),
    {
      required_error: 'Genre is required',
      message: 'Genre must be an array of strings',
    }
  ),

  releaseDate: z
    .string({
      required_error: 'Release date is required',
      message: 'Release date must be string',
    })
    .datetime({
      message:
        'Release date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    })
    .transform((val) => new Date(val)),

  cast: z
    .array(z.string({ message: 'Cast must be string' }), {
      message: 'Cast must be an array of strings',
    })
    .optional(),

  directors: z.array(z.string({ message: 'Directors must be string' }), {
    message: 'Directors must be an array of strings',
  }),

  runTime: z.number({
    required_error: 'Run time is required',
    message: 'Run time must be number (in minutes)',
  }),

  languages: z
    .array(
      z
        .string({ message: 'Languages must be string' })
        .transform((val) => val.toLowerCase()),
      {
        message: 'Languages must be an array of strings',
      }
    )
    .optional(),

  posterUrl: z
    .string({
      message: 'Poster url must be string',
    })
    .optional(),

  backdropUrl: z
    .string({
      message: 'Backdrop url must be string',
    })
    .optional(),

  isActive: z
    .boolean({
      message: 'Status must be boolean',
    })
    .optional()
    .default(true),

  status: z
    .string({
      required_error: 'Status is required',
      message: 'Status must be string',
    })
    .refine((val) => MEDIA_STATUS.includes(val), {
      message: `Status must be one of the following: ${MEDIA_STATUS.join(', ')}`,
    }),

  tags: z
    .array(
      z
        .string({ message: 'Tags must be string' })
        .refine((val) => TAGS.includes(val), {
          message: `Tags must be one of the following: ${TAGS.join(', ')}`,
        }),
      { message: 'Tags must be an array of strings' }
    )
    .optional(),

  totalSeasons: z.number({
    required_error: 'Total seasons is required',
    message: 'Total seasons must be number',
  }),

  totalEpisodes: z.number({
    required_error: 'Total episodes is required',
    message: 'Total episodes must be number',
  }),

  ageRating: z
    .number({
      message: 'Age rating must be number',
    })
    .optional(),

  seasons: z.array(AddSeasonZodSchema.omit({ tvShow: true })).optional(),
});

//type
export type AddTvShowZodType = z.infer<typeof AddTvShowZodSchema>;
