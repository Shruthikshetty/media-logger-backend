/**
 * @file contains all the routes related to game
 */

import { Router } from 'express';
import {
  addGame,
  deleteGameById,
  getAllGames,
  getGameById,
  updateGameById,
  bulkAddGames,
} from '../controllers/game.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { AddGameZodSchema } from '../common/validation-schema/game/add-game';
import { requireAuth } from '../common/middleware/require-auth';
import { UpdateGameZodSchema } from '../common/validation-schema/game/update-game';
import { BulkAddGameZodSchema } from '../common/validation-schema/game/bulk-add';
import jsonUpload from '../common/config/json-upload.config';
import { handleUpload } from '../common/middleware/handle-upload';
import { ValidateJsonFile } from '../common/middleware/handle-json-file-validation';

//initialize router
const route = Router();

// Route to get all games
route.get('/', getAllGames);

// Route to get a game by id
route.get('/:id', getGameById);

// Route to add a game
route.post('/', requireAuth('admin'), validateReq(AddGameZodSchema), addGame);

// Route to bulk add games
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'gameDataFile'),
  ValidateJsonFile(BulkAddGameZodSchema),
  bulkAddGames
);

// Route to delete a game by id
route.delete('/:id', requireAuth('admin'), deleteGameById);

// Route to update a game by id
route.patch(
  '/:id',
  requireAuth('admin'),
  validateReq(UpdateGameZodSchema),
  updateGameById
);

//export all the routes
export default route;
