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

  runTime: z.number({
    required_error: 'Run time is required',
    message: 'Run time must be number (minutes)',
  }),
});

// export the type
export type AddEpisodeZodType = z.infer<typeof AddEpisodeZodSchema>;
