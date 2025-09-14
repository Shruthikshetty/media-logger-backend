/**
 * This file contains the controller related to game
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import Game from '../models/game.model';
import {
  isDuplicateKeyError,
  isMongoIdValid,
} from '../common/utils/mongo-errors';
import { AddGameZodSchemaType } from '../common/validation-schema/game/add-game';
import {
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import {
  GAME_SEARCH_INDEX,
  GET_ALL_GAMES_LIMITS,
} from '../common/constants/config.constants';
import { UpdateGameZodSchemaType } from '../common/validation-schema/game/update-game';
import { BulkAddGameZodSchemaType } from '../common/validation-schema/game/bulk-add';
import { BulkDeleteGameZodType } from '../common/validation-schema/game/bulk-delete';
import { GamesFilterZodSchemaType } from '../common/validation-schema/game/games-filter';

//controller to get all the games
export const getAllGames = async (req: ValidatedRequest<{}>, res: Response) => {
  // get pagination params
  const { limit, start } = getPaginationParams(req.query, GET_ALL_GAMES_LIMITS);

  try {
    //find all the games
    const [games, total] = await Promise.all([
      Game.find()
        .skip(start)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      Game.countDocuments(),
    ]);

    // get pagination details
    const pagination = getPaginationResponse(total, limit, start);

    // send response
    res.status(200).json({
      success: true,
      data: {
        games,
        pagination,
      },
    });
  } catch (err) {
    //handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to get a game by id
export const getGameById = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    // get id from params
    const { id } = req.params;

    // check if id is a valid mongo id
    if (!isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid game id', statusCode: 400 });
      return;
    }

    //find the game by id
    const game = await Game.findById(id).lean().exec();

    // in case game is not found
    if (!game) {
      handleError(res, { message: 'Game not found', statusCode: 404 });
      return;
    }

    // Send response
    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

// controller to add a game
export const addGame = async (
  req: ValidatedRequest<AddGameZodSchemaType>,
  res: Response
) => {
  try {
    // create a new game
    const newGame = new Game(req.validatedData!);

    // save the game
    const savedGame = await newGame.save();

    // in case game is not saved
    if (!savedGame) {
      handleError(res, { message: 'Game creation failed' });
      return;
    }

    // return the saved game
    res.status(201).json({
      success: true,
      data: savedGame,
      message: 'Game created successfully',
    });
  } catch (err) {
    const isDuplicate = isDuplicateKeyError(err);
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicate ? 'Game already exists' : 'Game creation failed',
      statusCode: isDuplicate ? 409 : 500,
    });
  }
};

//controller to delete a game by id
export const deleteGameById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // check if id is a valid mongo id
    if (!isMongoIdValid(req.params?.id)) {
      handleError(res, { message: 'Invalid game id', statusCode: 400 });
      return;
    }

    // delete the game
    const deletedGame = await Game.findByIdAndDelete(req.params?.id)
      .lean()
      .exec();

    // in case game is not deleted
    if (!deletedGame) {
      handleError(res, { message: 'Game does not exist', statusCode: 404 });
      return;
    }

    // return the deleted game
    res.status(200).json({
      success: true,
      data: deletedGame,
      message: 'Game deleted successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to update a game
export const updateGameById = async (
  req: ValidatedRequest<UpdateGameZodSchemaType>,
  res: Response
) => {
  try {
    // check if id is a valid mongo id
    if (!isMongoIdValid(req.params?.id)) {
      handleError(res, { message: 'Invalid game id', statusCode: 400 });
      return;
    }

    //update the game by id
    const updatedGame = await Game.findByIdAndUpdate(
      req.params?.id,
      req.validatedData!,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )
      .lean()
      .exec();

    // in case game is not updated
    if (!updatedGame) {
      handleError(res, { message: 'Game not found', statusCode: 404 });
      return;
    }

    // return the updated game
    res.status(200).json({
      success: true,
      data: updatedGame,
      message: 'Game updated successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'Game already exists'
        : 'Server down please try again later',
    });
  }
};

//controller to bulk add games by taking json
export const bulkAddGames = async (
  req: ValidatedRequest<BulkAddGameZodSchemaType>,
  res: Response
) => {
  try {
    // add all games
    const games = await Game.insertMany(req.validatedData!, {
      ordered: false, // continuous insertion in case of error
      throwOnValidationError: true,
    });

    // return the added games
    res.status(201).json({
      success: true,
      data: {
        added: games,
        notAdded: [],
      },
      message: 'Games added successfully',
    });
  } catch (err: any) {
    // Extract failed (duplicate) docs from error object
    const notAdded = err?.writeErrors
      ? err.writeErrors.map((e: any) => e.err?.op ?? e.err?.doc ?? {})
      : [];

    //err.insertedDocs gives successfully inserted docs
    const added = err?.insertedDocs || [];

    // in case games are added partially
    if (added.length > 0) {
      // return the added games
      res.status(207).json({
        success: true,
        data: {
          added,
          notAdded,
        },
        message: 'Games partially added successfully',
      });
      return;
    }

    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'All games already exists'
        : 'Server down please try again later',
      statusCode: isDuplicateKeyError(err) ? 409 : 500,
    });
  }
};
//controller to bulk delete games by taking ids
export const bulkDeleteGames = async (
  req: ValidatedRequest<BulkDeleteGameZodType>,
  res: Response
) => {
  try {
    const gameIds = req.validatedData!.gameIds;

    // delete all games
    const games = await Game.deleteMany({
      _id: { $in: gameIds },
    });

    // in case game is not found
    if (games.deletedCount === 0) {
      handleError(res, {
        message: 'No games found',
        statusCode: 404,
      });
      return;
    }

    // return the deleted games
    res.status(200).json({
      success: true,
      data: {
        deleCount: games.deletedCount,
      },
      message:
        games.deletedCount === gameIds.length
          ? 'All games deleted successfully'
          : 'Some games could not be deleted (IDs not found or already deleted)',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller for search title
export const searchGame = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    // get query from params
    const { text } = req.query;

    //get pagination params
    const { limit, start } = getPaginationParams(
      req.query,
      GET_ALL_GAMES_LIMITS
    );

    //search pipeline (atlas search)
    const pipeline = [
      {
        $search: {
          index: GAME_SEARCH_INDEX,
          text: {
            query: text,
            path: ['title'],
          },
        },
      },
    ];

    // get the games
    const games = await Game.aggregate(pipeline)
      .skip(start)
      .limit(limit)
      .exec();

    //send response
    res.status(200).json({
      success: true,
      data: {
        games,
        pagination: {
          limit,
          start,
        },
      },
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller for games filter
export const filterGames = async (
  req: ValidatedRequest<GamesFilterZodSchemaType>,
  res: Response
) => {
  try {
    //destructure the filters from validated data
    const {
      genre,
      platforms,
      status,
      avgPlaytime,
      releaseDate,
      averageRating,
      page,
      ageRating,
      limit,
    } = req.validatedData!;
    //define filters and pipeline
    const filters: any[] = [];
    const pipeline: any[] = [];

    // if genre is defined
    if (genre) {
      filters.push({
        in: {
          path: 'genre',
          value: genre,
        },
      });
    }

    //if platform is defined
    if (platforms) {
      filters.push({
        in: {
          path: 'platforms',
          value: platforms,
        },
      });
    }

    //if status is defined
    if (status) {
      filters.push({
        in: {
          path: 'status',
          value: status,
        },
      });
    }

    //if avgPlaytime is defined
    if (avgPlaytime) {
      filters.push({
        range: {
          path: 'avgPlaytime',
          ...avgPlaytime,
        },
      });
    }

    //if releaseDate is defined
    if (releaseDate) {
      filters.push({
        range: {
          path: 'releaseDate',
          ...releaseDate,
        },
      });
    }

    //if ageRating is defined
    if (ageRating) {
      filters.push({
        range: {
          path: 'ageRating',
          ...ageRating,
        },
      });
    }

    //if averageRating is defined
    if (averageRating) {
      filters.push({
        range: {
          path: 'averageRating',
          gte: averageRating,
        },
      });
    }

    //if filters are defined
    if (filters.length > 0) {
      pipeline.push({
        $search: {
          index: GAME_SEARCH_INDEX,
          compound: {
            filter: filters,
          },
        },
      });
    }

    //Use $facet to get both paginated data and total count in one query
    const skip = (page - 1) * limit;
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'total' }],
      },
    });

    // get the data from the db
    const result = await Game.aggregate(pipeline);

    // extract the data , pagination and total count from the result
    const data = result[0]?.data;
    const totalCount = result[0]?.totalCount[0]?.total || 0;
    const pagination = getPaginationResponse(totalCount, limit, skip);

    //send response
    res.status(200).json({
      success: true,
      data: {
        games: data,
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
