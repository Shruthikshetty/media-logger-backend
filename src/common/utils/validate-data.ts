/**
 * @file contains some utility used for data validation
 */
import { z } from 'zod';
import { Response } from 'express';
import { handleError } from './handle-error';

/**
 * Validates data against a Zod schema.
 * If validation fails, it automatically sends a 400 response and returns undefined.
 * If validation succeeds, it returns the parsed data.
 */
export const validateDataUsingZod = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  res: Response
): T | undefined => {
  const result = schema.safeParse(data);

  // in case validations fail
  if (!result.success) {
    const { fieldErrors, formErrors } = result.error.flatten();
    // combine errors
    const combinedErrors = [
      ...Object.values(fieldErrors).flat(),
      ...formErrors,
    ];

    // get all the error's
    const errorMessage = Object.values(combinedErrors).flat().join(' | ');

    //send the response
    handleError(res, {
      message: errorMessage,
      error: combinedErrors,
      statusCode: 400,
    });
    // return  undefined if fails
    return undefined;
  }

  // attach validated data
  return result.data;
};
