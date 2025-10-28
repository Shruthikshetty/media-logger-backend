/**
 * This file contains the controller related to history
 */

import { GET_ALL_HISTORY_LIMITS } from '../common/constants/config.constants';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import { handleError } from '../common/utils/handle-error';
import { getHistoryWithTotal } from '../common/utils/get-history';

// controller to get all the history
export const getAllHistory = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    const { fullDetails } = req.query;

    // get pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_HISTORY_LIMITS
    );

    // find all history
    const [history, total] = await getHistoryWithTotal({
      fullDetails: (fullDetails as string) ?? 'false',
      start,
      limit,
    });

    // get pagination details
    const pagination = getPaginationResponse(total, limit, start);

    // send response
    res.status(200).json({
      success: true,
      data: {
        history,
        pagination,
      },
    });
  } catch (err) {
    // handle any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
