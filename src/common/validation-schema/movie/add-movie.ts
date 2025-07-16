/**
 * @file contains zod schema for adding movies
 */

import z from 'zod';
import { MEDIA_STATUS, TAGS } from '../../constants/model.constants';

//schema
export const AddMovieZodSchema = z.object({
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
  cast: z
    .array(z.string({ message: 'Cast must be string' }), {
      message: 'Cast must be an array of strings',
    })
    .default([])
    .optional(),
  directors: z
    .array(z.string({ message: 'Directors must be string' }), {
      message: 'Directors must be an array of strings',
    })
    .default([])
    .optional(),
  runTime: z.number({
    required_error: 'Run time is required',
    message: 'Run time must be number',
  }),
  languages: z
    .array(z.string({ message: 'Languages must be string' }), {
      required_error: 'Languages is required',
      message: 'Languages must be an array of strings',
    })
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
    .default(true)
    .optional(),
  status: z
    .string({
      required_error: 'Status is required',
      message: 'Status must be string',
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
    message: 'Age rating must be number',
  }),
  trailerYoutubeUrl: z
    .string({
      message: 'Trailer youtube url must be string',
    })
    .optional(),
  releaseDate: z.string({
    required_error: 'Release date is required',
    message: 'Release date must be string in ISO format',
  }),
});

//export the type
export type AddMovieZodSchemaType = z.infer<typeof AddMovieZodSchema>;
