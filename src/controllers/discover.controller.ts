/**
 * @file contains all the controllers related to discover route
 */

import { Response } from 'express';
import { handleError } from '../common/utils/handle-error';
import { ValidatedRequest } from '../types/custom-types';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import {
  GET_ALL_GAMES_LIMITS,
  GET_ALL_MOVIES_LIMITS,
} from '../common/constants/config.constants';
import Game from '../models/game.model';
import Movie from '../models/movie.model';

// controller to get discover games
export const getDiscoverGames = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // get user id if it exist
    const userId = req?.userData?._id;

    //generate pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_GAMES_LIMITS
    );

    //define a pipeline
    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      { $skip: start },
      { $limit: limit },
    ];

    //if user is logged in attach media entry data
    if (userId) {
      pipeline.push(
        {
          $lookup: {
            from: 'mediaentries',
            let: { gameId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$user', userId] },
                      { $eq: ['$onModel', 'Game'] },
                      { $eq: ['$mediaItem', '$$gameId'] },
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
        }
      );
    }

    // execute pipeline
    const [games, total] = await Promise.all([
      Game.aggregate(pipeline),
      Game.countDocuments(),
    ]);

    // extract the pagination data
    const pagination = getPaginationResponse(total, limit, start);

    //send response
    res.status(200).json({
      success: true,
      data: {
        games,
        pagination,
      },
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

// controller to get discover movies
export const getDiscoverMovies = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //get user id if exists
    const userId = req?.userData?._id;
    //generate pagination
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_MOVIES_LIMITS
    );

    //define a pipeline
    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      { $skip: start },
      { $limit: limit },
    ];

    //if user is logged in generate media entry details
    if (userId) {
      pipeline.push(
        {
          $lookup: {
            from: 'mediaentries',
            let: { movieId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$user', userId] },
                      { $eq: ['$onModel', 'Movie'] },
                      { $eq: ['$mediaItem', '$$movieId'] },
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
        }
      );
    }

    // execute pipeline
    const [movies, total] = await Promise.all([
      Movie.aggregate(pipeline),
      Movie.countDocuments(),
    ]);

    //return response
    res.status(200).json({
      success: true,
      data: {
        movies,
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
