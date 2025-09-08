/**
 * @file contains zod schema for adding movies
 */

import z from 'zod';
import {
  GENRE_MOVIE_TV,
  MEDIA_STATUS,
  TAGS,
} from '../../constants/model.constants';

//schema
export const AddMovieZodSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be string',
  }),
  averageRating: z
    .number({
      message: 'Average rating must be number',
    })
    .max(10, 'Average rating can be at most 10')
    .optional(),
  cast: z
    .array(z.string({ message: 'Cast must be string' }), {
      message: 'Cast must be an array of strings',
    })
    .optional()
    .default([]),
  directors: z
    .array(z.string({ message: 'Directors must be string' }), {
      message: 'Directors must be an array of strings',
    })
    .optional()
    .default([]),
  runTime: z.number({
    required_error: 'Run time is required',
    invalid_type_error: 'Run time must be number',
  }),
  languages: z
    .array(
      z
        .string({ message: 'Languages must be string' })
        .transform((val) => val.toLocaleLowerCase()),
      {
        invalid_type_error: 'Languages must be an array of strings',
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
      message: 'Is active must be boolean',
    })
    .optional()
    .default(true),
  status: z
    .string({
      invalid_type_error: 'Status must be string',
    })
    .refine((val) => MEDIA_STATUS.includes(val), {
      message: `Status must be one of the following: ${MEDIA_STATUS.join(
        ', '
      )}`,
    })
    .optional(),
  tags: z
    .array(
      z
        .string({ message: 'Tags must be string' })
        .refine((val) => TAGS.includes(val), {
          message: `Tags must be one of the following: ${TAGS.join(', ')}`,
        }),
      {
        message: 'Tags must be an array of strings',
      }
    )
    .optional(),
  ageRating: z.number({
    required_error: 'Age rating is required',
    invalid_type_error: 'Age rating must be number',
  }),
  youtubeVideoId: z
    .string({
      message: 'Trailer youtube embed id must be string',
    })
    .optional(),
  releaseDate: z
    .string({
      required_error: 'Release date is required',
      invalid_type_error: 'Release date must be string in ISO format',
    })
    .datetime({
      message:
        'Release date must be a valid ISO 8601 string (e.g., "2024-01-01T00:00:00.000Z")',
    })
    .transform((val) => new Date(val)),
  genre: z
    .array(
      z
        .string({ message: 'Genre must be string' })
        .refine((val) => GENRE_MOVIE_TV.includes(val), {
          message: `Genre must be one of the following: ${GENRE_MOVIE_TV.join(
            ', '
          )}`,
        }),
      {
        message: 'Genre must be an array of strings',
      }
    )
    .default([]),
});

//export the type
export type AddMovieZodSchemaType = z.infer<typeof AddMovieZodSchema>;
