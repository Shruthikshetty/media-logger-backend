import { Model, Types } from 'mongoose';
import { ValidatedRequest } from '../../types/custom-types';
import {
  getPaginationParams,
  getPaginationResponse,
  PaginationLimits,
} from './pagination';
import { Response } from 'express';
import { handleError } from './handle-error';
//types
type MediaEntryModelType = 'Game' | 'Movie' | 'TVShow';

//helper to build the look up pipeline stage for discover media
export const buildMediaEnrichment = (
  userId: unknown | Types.ObjectId | undefined,
  onModel: MediaEntryModelType
) => {
  if (!userId || !onModel) return [];
  //if user is logged in generate media entry details
  return [
    {
      $lookup: {
        from: 'mediaentries',
        let: { mediaId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', userId] },
                  { $eq: ['$onModel', onModel] },
                  { $eq: ['$mediaItem', '$$mediaId'] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              user: 1,
              onModel: 1,
              status: 1,
              rating: 1,
            },
          },
        ],
        as: 'mediaEntry',
      },
    },
    {
      $addFields: {
        mediaEntry: {
          $cond: {
            // Check if the array has items
            if: { $gt: [{ $size: '$mediaEntry' }, 0] },
            // If YES: take the first item
            then: { $arrayElemAt: ['$mediaEntry', 0] },
            // If NO: explicitly set to null
            else: null,
          },
        },
      },
    },
  ];
};

/**
 * A helper function to get discover items of a particular media type
 *
 * @param {ValidatedRequest<null>} req - The express request object
 * @param {Response} res - The express response object
 * @param {Object} options - The options object containing the following properties
 * @param {Model<any>} options.MediaModel - The mongoose model for the media type
 * @param {MediaEntryModelType} options.onModel - The type of the media item to discover
 * @param {string} options.mediaKey - The key to use for the media items in the response
 * @param {PaginationLimits} options.limits - The pagination limits object
 */

export const getDiscoverItems = async (
  req: ValidatedRequest<null>,
  res: Response,
  options: {
    MediaModel: Model<any>;
    onModel: MediaEntryModelType;
    mediaKey: string;
    limits: PaginationLimits;
  }
) => {
  try {
    //get user id if exists
    const userId = req?.userData?._id;
    //generate pagination
    const { limit, start } = getPaginationParams(req.query, options.limits);

    //define a pipeline
    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      { $skip: start },
      { $limit: limit },
      ...buildMediaEnrichment(userId, options.onModel),
    ];

    // execute pipeline
    const [data, total] = await Promise.all([
      options.MediaModel.aggregate(pipeline),
      options.MediaModel.countDocuments(),
    ]);

    //return response
    res.status(200).json({
      success: true,
      data: {
        mediaKey: data,
        pagination: getPaginationResponse(total, limit, start),
      },
    });
  } catch (err) {
    //handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
