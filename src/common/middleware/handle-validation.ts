/**
 * @file Middleware to handle validation using zod
 */

import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { validateDataUsingZod } from '../utils/validate-data';

/**
 * Middleware to check validation results and return errors if any
 */
export const validateReq = (schema: z.ZodSchema<any>) => {
  // return a middleware
  return (req: Request, res: Response, next: NextFunction) => {
    //validate data
    const result = validateDataUsingZod(schema, req.body, res);
    // in case validations fail
    if (!result) return;
    // attach validated data
    // @ts-ignore
    req.validatedData = result;
    next();
  };
};
