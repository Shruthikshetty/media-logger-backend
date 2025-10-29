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
import { HistoryFilterZodType } from '../common/validation-schema/history/history-filter';
import History from '../models/history.model';

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

// controller to get history by filters
export const getHistoryByFilters = async (
  req: ValidatedRequest<HistoryFilterZodType>,
  res: Response
) => {
  try {
    // destructure validated data
    const { action, bulk, entityType, fullDetails, ...pagination } =
      req.validatedData!;
    // get pagination params
    const { limit, start } = getPaginationParams(
      pagination,
      GET_ALL_HISTORY_LIMITS
    );

    //define a filter and pipeline
    const pipeline: any[] = [];
    const filters: Record<string, any> = {};
    // add filters if they are present
    if (action) {
      filters.action = action;
    }
    if (bulk !== undefined) {
      filters.bulk = bulk;
    }
    if (entityType) {
      filters.entityType = entityType;
    }

    // Add the $match stage only if there are filters
    if (Object.keys(filters).length > 0) {
      pipeline.push({ $match: filters });
    }

    //in case we need full details
    if (fullDetails === true) {
      pipeline.push(
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        // unwind the user array to a single document(object)
        {
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        // remove sensitive data
        {
          $project: {
            'userDetails.password': 0,
          },
        }
      );
    }

    // Use $facet to get both data and total count in one query
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: start },
          { $limit: limit },
        ],
        totalCount: [{ $count: 'total' }],
      },
    });
    //execute the pipeline
    const results = await History.aggregate(pipeline).exec();

    // extract the history data and pagination details from result
    const facet = results[0] ?? { data: [], totalCount: [] };
    const history = Array.isArray(facet.data) ? facet.data : [];
    const total = facet.totalCount?.[0]?.total ?? 0;

    //send response
    res.status(200).json({
      success: true,
      data: {
        history,
        pagination: getPaginationResponse(total, limit, start),
      },
    });
  } catch (err) {
    // handle any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
