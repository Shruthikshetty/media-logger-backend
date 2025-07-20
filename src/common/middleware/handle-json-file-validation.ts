import { NextFunction, Response, Request } from 'express';
import z from 'zod';
import { handleError } from '../utils/handle-error';
import fs from 'fs';
import { devLogger } from '../utils/logger';

//function to delete file
const unlinkFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    devLogger(JSON.stringify(err, null, 2));
  }
};

/**
 * This middleware validates a JSON file uploaded by Multer using Zod.
 * The middleware assumes that the file is located in the 'file' property of the request object.(hence call multer middleware first)
 * If the validation fails, the middleware will return an error response with the validation errors.
 * If the validation succeeds, the middleware will attach the validated data to the 'validatedData' property of the request object.
 * @param schema The Zod schema to validate the JSON file with.
 * @returns A middleware function that validates the JSON file and attaches the validated data to the request object.
 */
export const ValidateJsonFile = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //Check if a file was uploaded by Multer
    if (!req.file) {
      handleError(res, {
        message: 'No file uploaded. Please upload a JSON file.',
        statusCode: 400,
      });
      return;
    }

    // extract the file path
    const filePath = req.file.path;

    try {
      // Read the file content asynchronously
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
      const jsonData = JSON.parse(fileContent);

      // parse request body
      const result = schema.safeParse(jsonData);

      // in case validations fail
      if (!result.success) {
        // Flatten errors
        const { fieldErrors, formErrors } = result.error.flatten();

        // combine errors
        const allErrors = [...Object.values(fieldErrors).flat(), ...formErrors];

        // Filter deduplicate error messages using a Set
        const uniqueErrors = [...new Set(allErrors)];

        // get all the error's
        const errorMessage = Object.values(uniqueErrors).flat().join(' | ');
        unlinkFile(filePath);
        handleError(res, { message: errorMessage, error: uniqueErrors });
        return;
      }

      // attach validated data
      // @ts-ignore
      req.validatedData = result.data;
      unlinkFile(filePath);
      next();
    } catch (err) {
      unlinkFile(filePath);
      // handle unexpected error
      handleError(res, {
        error: err,
      });
    }
  };
};
