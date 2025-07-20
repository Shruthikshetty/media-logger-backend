import { Multer } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/handle-error';

type UploadType = 'single' | 'array';
/**
 * A middleware to handle file upload using Multer.
 * handles any errors that may occur during the upload process.
 * @param uploader - The Multer instance used for file upload.
 * @param fieldName - The field name of the file in the request.
 * @param uploadType - The type of upload, either 'single' or 'array'.
 * @param maxCount - The maximum number of files to be uploaded. Only applicable for 'array' upload type.
 */
export const handleUpload = (
  uploader: Multer,
  fieldName: string,
  uploadType: UploadType = 'single',
  maxCount?: number
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Determine which Multer method to call based on the upload type
    const uploadHandler =
      uploadType === 'single'
        ? uploader.single(fieldName)
        : uploader.array(fieldName, maxCount);

    uploadHandler(req, res, (err: any) => {
      if (err) {
        handleError(res, {
          message: `File upload error ${err.message}`,
          statusCode: 400,
        });
        return;
      }
      // Call the next middleware if no errors
      next();
    });
  };
};
