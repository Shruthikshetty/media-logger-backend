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
import { GET_ALL_GAMES_LIMITS } from '../common/constants/config.constants';
import { UpdateGameZodSchemaType } from '../common/validation-schema/game/update-game';
import { BulkAddGameZodSchemaType } from '../common/validation-schema/game/bulk-add';

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
    res.status(200).json({
      success: true,
      data: savedGame,
      message: 'Game created successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'Game already exists'
        : 'Game creation failed',
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
      handleError(res, { message: 'Game dose not exist' });
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
      }
    )
      .lean()
      .exec();

    // in case game is not updated
    if (!updatedGame) {
      handleError(res, { message: 'Game not found' });
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
    const games = await Game.insertMany(req.validatedData!);

    // return the added games
    res.status(200).json({
      success: true,
      data: games,
      message: 'Games added successfully',
    });
    
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
      message: isDuplicateKeyError(err)
        ? 'One of the game already exists'
        : 'Server down please try again later',
    });
  }
};
//@TODO controller to bulk delete games by taking ids
//@TODO controller for search
//@TODO controller for filter
