/**
 * This @file contains all the controllers related to media entry
 */

import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';

//controller to add a new media entry
export const addNewMediaEntry = (req: ValidatedRequest<{}>, res: Response) => {
  try {
    //
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    //handle unexpected errors
    handleError(res, {
      error: err,
    });
  }
};
