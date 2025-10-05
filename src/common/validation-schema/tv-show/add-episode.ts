/**
 * @file contains zod schema for adding a episode to a season
 */

//import zod
import z from 'zod';
import { isMongoIdValid } from '../../utils/mongo-errors';

//schema
export const AddEpisodeZodSchema = z.object({
  season: z
    .string({
      required_error: 'Season ref id is required',
      message: 'Season ref id must be string',
    })
    .refine((val) => isMongoIdValid(val), { message: 'Invalid season id' }),

  title: z.string({
    required_error: 'Title is required',
    message: 'Title must be string',
  }),

  description: z
    .string({
      message: 'Description must be string',
    })
    .optional(),

  episodeNumber: z.number({
    required_error: 'Episode number is required',
    message: 'Episode number must be number',
  }),

  releaseDate: z
    .string({
      message: 'Release date must be  iso date string',
    })
    .optional(),

  runTime: z
    .number({
      message: 'Run time must be number (minutes)',
    })
    .optional(),

  stillUrl: z
    .string({
      message: 'Still URL must be a valid URL',
    })
    .url()
    .optional(),

  averageRating: z
    .number({
      message: 'Average rating must be a number',
    })
    .min(0, { message: 'Rating cannot be negative' })
    .max(10, { message: 'Rating cannot be greater than 10' })
    .optional(),
});

// export the type
export type AddEpisodeZodType = z.infer<typeof AddEpisodeZodSchema>;
