/**
 * @file Middleware to handle validation results from express-validator
 */

import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/handle-error';
import z from 'zod';

/**
 * Middleware to check validation results and return errors if any
 */
export const validateReq = (schema: z.ZodSchema<any>) => {
  // return a middleware
  return (req: Request, res: Response, next: NextFunction) => {
    // parse request body
    const result = schema.safeParse(req.body);

    // in case validations fail
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      // get all the error's
      const errorMessage = Object.values(errors).flat().join(' | ');

      handleError(res, { message: errorMessage, error: errors });
      return;
    }

    // attach validated data
    // @ts-ignore
    req.validatedData = result.data;
    next();
  };
};
