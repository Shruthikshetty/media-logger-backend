import axios from 'axios';
import { handleError } from './handle-error';
import { isMongoIdValid } from './mongo-errors';
import { Response } from 'express';
import { RECOMMENDER_MS_REQUEST_TIMEOUT } from '../constants/config.constants';
import { Model } from 'mongoose';
import { ValidatedRequest } from '../../types/custom-types';

// common utility to fetch and send similar media from recommender based on the config passed
export async function getSimilarMedia<T>(
  req: ValidatedRequest<{}>,
  res: Response,
  config: {
    endpoint: string;
    model: Model<any>;
    responseField: string;
    mediaType: string;
  }
) {
  try {
    //get the id from the request
    const { id } = req.params;
    if (!id || !isMongoIdValid(id)) {
      handleError(res, {
        message: `Invalid ${config.mediaType} id`,
        statusCode: 400,
      });
      return;
    }

    // get the recommendation from the recommendation ms
    const headers: Record<string, string> = {};
    if (req.id) {
      headers['X-Request-Id'] = req.id;
    }

    const response = await axios.get<T>(`${config.endpoint}/${id}`, {
      timeout: RECOMMENDER_MS_REQUEST_TIMEOUT,
      headers,
      // Let all HTTP statuses resolve so we can handle non‑200 explicitly
      validateStatus: () => true,
    });

    // extract the response data from the recommendation ms
    const data = response.data as any;
    const similarIds = data[config.responseField] || [];

    if (!data?.success || !Array.isArray(similarIds) || similarIds.length < 1) {
      // send the response
      handleError(res, {
        message: `No similar ${config.mediaType}s found try again later`,
      });
      return;
    }

    // get the full data from  db
    const items = await config.model
      .find({ _id: { $in: similarIds } })
      .lean()
      .exec();

    // send the response
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    //handle unexpected error
    handleError(res, { error: error });
  }
}
