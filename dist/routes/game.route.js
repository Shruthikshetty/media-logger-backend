"use strict";
/**
 * @file contains all the routes related to game
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_controller_1 = require("../controllers/game.controller");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_game_1 = require("../common/validation-schema/game/add-game");
const require_auth_1 = require("../common/middleware/require-auth");
const update_game_1 = require("../common/validation-schema/game/update-game");
const bulk_add_1 = require("../common/validation-schema/game/bulk-add");
const json_upload_config_1 = __importDefault(require("../common/config/json-upload.config"));
const handle_upload_1 = require("../common/middleware/handle-upload");
const handle_json_file_validation_1 = require("../common/middleware/handle-json-file-validation");
const bulk_delete_1 = require("../common/validation-schema/game/bulk-delete");
const games_filter_1 = require("../common/validation-schema/game/games-filter");
//initialize router
const route = (0, express_1.Router)();
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
route.get('/', game_controller_1.getAllGames);
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
route.get('/search', game_controller_1.searchGame);
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
route.get('/:id', game_controller_1.getGameById);
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
route.post('/', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_game_1.AddGameZodSchema), game_controller_1.addGame);
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
route.post('/filter', (0, handle_validation_1.validateReq)(games_filter_1.GamesFilterZodSchema), game_controller_1.filterGames);
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
 *       '207':
 *         $ref: '#/components/responses/BulkAddGamePartialResponse'
 *       '409':
 *         $ref: '#/components/responses/Conflict'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.post('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(json_upload_config_1.default, 'gameDataFile'), (0, handle_json_file_validation_1.ValidateJsonFile)(bulk_add_1.BulkAddGameZodSchema), game_controller_1.bulkAddGames);
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
route.delete('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(bulk_delete_1.BulkDeleteGameZodSchema), game_controller_1.bulkDeleteGames);
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
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), game_controller_1.deleteGameById);
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
route.patch('/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_game_1.UpdateGameZodSchema), game_controller_1.updateGameById);
//export all the routes
exports.default = route;
