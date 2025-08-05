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
  bulkDeleteGames,
  bulkAddGames,
  filterGames,
  searchGame,
} from '../controllers/game.controller';
import { validateReq } from '../common/middleware/handle-validation';
import { AddGameZodSchema } from '../common/validation-schema/game/add-game';
import { requireAuth } from '../common/middleware/require-auth';
import { UpdateGameZodSchema } from '../common/validation-schema/game/update-game';
import { BulkAddGameZodSchema } from '../common/validation-schema/game/bulk-add';
import jsonUpload from '../common/config/json-upload.config';
import { handleUpload } from '../common/middleware/handle-upload';
import { ValidateJsonFile } from '../common/middleware/handle-json-file-validation';
import { BulkDeleteGameZodSchema } from '../common/validation-schema/game/bulk-delete';
import { GamesFilterZodSchema } from '../common/validation-schema/game/games-filter';

//initialize router
const route = Router();

/**
 * @swagger
 * /api/game:
 *   get:
 *     summary: Get all games with pagination and sorting
 *     tags: [Games]
 *     parameters:
 *       - name: limit
 *         in: query
 *         default: 20
 *         schema:
 *           type: integer
 *         required: false
 *       - name: page
 *         in: query
 *         default: 1
 *         schema:
 *           type: integer
 *         required: false
 *       - name: start
 *         default: 0
 *         in: query
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllGamesSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/', getAllGames);

/**
 * @swagger
 * /api/game/search:
 *   get:
 *     summary: Search games by title
 *     tags: [Games]
 *     parameters:
 *       - name: text
 *         in: query
 *         required: true
 *         type: string
 *         example: "The Legend of Zelda"
 *       - name: limit
 *         in: query
 *         default: 20
 *         schema:
 *           type: integer
 *         required: false
 *       - name: start
 *         default: 0
 *         in: query
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllGamesSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/search', searchGame);

/**
 * @swagger
 * /api/game/{id}:
 *   get:
 *     summary: Get game by id
 *     tags: [Games]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetGameSuccessResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *  */
route.get('/:id', getGameById);

// Route to add a game
route.post('/', requireAuth('admin'), validateReq(AddGameZodSchema), addGame);

// Route to get games by filter
route.post('/filter', validateReq(GamesFilterZodSchema), filterGames);

// Route to bulk add games
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'gameDataFile'),
  ValidateJsonFile(BulkAddGameZodSchema),
  bulkAddGames
);

//Route to bulk delete games
route.delete(
  '/bulk',
  requireAuth('admin'),
  validateReq(BulkDeleteGameZodSchema),
  bulkDeleteGames
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
