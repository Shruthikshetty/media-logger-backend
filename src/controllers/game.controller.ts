/**
 * This file contains the controller related to game
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import Game from '../models/game.model';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import { AddGameZodSchemaType } from '../common/validation-schema/game/add-game';

//controller to get all the games
export const getAllGames = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    //find all the games
    const games = await Game.find().lean().exec();

    // send response
    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (err) {
    //handle unexpected error
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
