/**
 * @file contains all the controllers related to recommendation service
 */

import { Request, Response } from 'express';
import { Endpoints } from '../common/constants/endpoints.constants';
import axios from 'axios';
import { RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT } from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';

//check the health of the recommendation ms
export const getHealth = async (_req: Request, res: Response) => {
  try {
    //get the health from the recommendation ms
    const response = await axios.get(Endpoints.recommender.health, {
      timeout: RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT,
    });

    // if we receive a 200 status code
    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: 'recommender service is running',
      });
      return;
    }

    // in case we don't get a success response
    res.status(500).json({
      success: false,
      message: 'recommender service is down',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
