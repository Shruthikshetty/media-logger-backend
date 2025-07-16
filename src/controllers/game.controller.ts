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
