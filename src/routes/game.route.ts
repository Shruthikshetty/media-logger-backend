/**
 * @file contains all the routes related to game
 */

import { Router } from 'express';
import { addGame, getAllGames } from '../controllers/game.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { AddGameZodSchema } from '../common/validation-schema/game/add-game';
import { requireAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

// Route to get all games
route.get('/', getAllGames);

// Route to add a game
route.post('/', requireAuth('admin'), validateReq(AddGameZodSchema), addGame);

//export all the routes
export default route;
