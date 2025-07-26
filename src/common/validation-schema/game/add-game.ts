/**
 * this @file contains the validation schema from adding a game
 */

import z from 'zod';
import {
  GAME_GENRES,
  GAME_PLATFORMS,
  MEDIA_STATUS,
} from '../../constants/model.constants';

export const AddGameZodSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      message: 'Title must be string',
    })
    .min(3, 'Title must be at least 3 characters long'),

  description: z
    .string({
      required_error: 'Description is required',
      message: 'Description must be string',
    })
    .min(3, 'Description must be at least 3 characters long'),

  genre: z.array(
    z
      .string({
        required_error: 'Genre is required',
        message: 'Genre must be string',
      })
      .refine(
        (val) => {
          return GAME_GENRES.includes(val);
        },
        {
          message: `Genre must be one of the following: ${GAME_GENRES.join(', ')}`,
        }
      ),
    {
      message: 'Genre must be an array of strings',
    }
  ),

  releaseDate: z
    .string({
      required_error: 'Release date is required',
      message: 'Release date must be date string in iso format',
    })
    .datetime({ message: 'Release date must be in iso format' })
    .transform((val) => new Date(val)),

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
      required_error: 'Status is required',
      message: 'Status must be string',
    })
    .refine((val) => MEDIA_STATUS.includes(val), {
      message: `Status must be one of the following: ${MEDIA_STATUS.join(
        '| '
      )}`,
    }),

  platforms: z.array(
    z
      .string({ message: 'Platforms must be string' })
      .refine((val) => GAME_PLATFORMS.includes(val), {
        message: `Platforms must be one of the following: ${GAME_PLATFORMS.join(
          ', '
        )}`,
      }),
    {
      message: 'Platforms must be an array of strings',
    }
  ),

  avgPlaytime: z
    .number({
      message: 'Average playtime must be number',
    })
    .optional(),

  developer: z
    .string({
      message: 'Developer must be string',
    })
    .optional(),

  ageRating: z
    .number({
      message: 'Age rating must be number',
    })
    .optional(),

  trailerYoutubeUrl: z
    .string({
      message: 'Trailer youtube url must be string',
    })
    .optional(),
});

// exporting the type
export type AddGameZodSchemaType = z.infer<typeof AddGameZodSchema>;
