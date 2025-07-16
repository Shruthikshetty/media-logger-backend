/**
 * @file contains all the routes related to game
 */

import { Router } from 'express';
import {
  addGame,
  deleteGameById,
  getAllGames,
  getGameById,
} from '../controllers/game.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { AddGameZodSchema } from '../common/validation-schema/game/add-game';
import { requireAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

// Route to get all games
route.get('/', getAllGames);

// Route to get a game by id
route.get('/:id', getGameById);

// Route to add a game
route.post('/', requireAuth('admin'), validateReq(AddGameZodSchema), addGame);

// Route to delete a game by id
route.delete('/:id', requireAuth('admin'), deleteGameById);

//export all the routes
export default route;
