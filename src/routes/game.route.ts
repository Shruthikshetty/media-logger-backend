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

/**
 * @swagger
 * /api/game:
 *   post:
 *     summary: Add game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddGameRequest'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/AddGameSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/', requireAuth('admin'), validateReq(AddGameZodSchema), addGame);

/**
 * @swagger
 * /api/game/filter:
 *   post:
 *     summary: Get games by filters
 *     tags: [Games]
 *     requestBody:
 *       $ref: '#/components/requestBodies/GamesFilterRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetAllGamesSuccessResponse'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/filter', validateReq(GamesFilterZodSchema), filterGames);
/**
 * @swagger
 * /api/game/bulk:
 *   post:
 *     summary: Bulk add games from uploaded JSON file
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               gameDataFile:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing an array of games
 *           encoding:
 *             gameDataFile:
 *               contentType: application/json
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/BulkAddGameSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '409':
 *         $ref: '#/components/responses/BulkAddGameConflictResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post(
  '/bulk',
  requireAuth('admin'),
  handleUpload(jsonUpload, 'gameDataFile'),
  ValidateJsonFile(BulkAddGameZodSchema),
  bulkAddGames
);

/**
 * @swagger
 * /api/game/bulk:
 *   delete:
 *     summary: Bulk delete games by ids
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/BulkDeleteGameRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteBulkGameSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete(
  '/bulk',
  requireAuth('admin'),
  validateReq(BulkDeleteGameZodSchema),
  bulkDeleteGames
);

/**
 * @swagger
 * /api/game/{id}:
 *   delete:
 *     summary: Delete game by id
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/DeleteGameSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.delete('/:id', requireAuth('admin'), deleteGameById);

/**
 * @swagger
 * /api/game/{id}:
 *   patch:
 *     summary: Update game by id requires admin access
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateGameRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UpdateGameSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.patch(
  '/:id',
  requireAuth('admin'),
  validateReq(UpdateGameZodSchema),
  updateGameById
);

//export all the routes
export default route;
