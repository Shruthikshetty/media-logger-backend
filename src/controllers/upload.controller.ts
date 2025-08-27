/**
 * this file contains all the controllers related to upload
 */

import cloudinary from '../common/config/cloudinary.config';
import { CLOUDINARY_FOLDER } from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';
import { logger } from '../common/utils/logger';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import fs from 'fs';

//controller used to upload image to cdn
export const uploadImage = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    //check if file exist
    if (!req.file) {
      handleError(res, { message: 'No file uploaded', statusCode: 400 });
      return;
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: CLOUDINARY_FOLDER,
      use_filename: true,
    });

    // Return the uploaded image URL
    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
      },
      message: 'Image uploaded successfully',
    });
  } catch (err) {
    //catch any unexpected error
    handleError(res, {
      error: err,
    });
  } finally {
    //remove the local file
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          logger.warn(`Failed to remove temp file: ${(err as Error)?.message}`);
        }
      });
    }
  }
};
