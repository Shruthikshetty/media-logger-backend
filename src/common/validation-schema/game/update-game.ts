/**
 * @file contains zod schema for updating game
 */

import z from 'zod';
import { AddGameZodSchema } from './add-game';

//schema
export const UpdateGameZodSchema = AddGameZodSchema.partial().superRefine(
  (data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be updated',
        path: [],
      });
    }
  }
);

// export the type
export type UpdateGameZodSchemaType = z.infer<typeof UpdateGameZodSchema>;
