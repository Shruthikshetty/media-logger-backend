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
// Route to search games
route.get('/search', game_controller_1.searchGame);
// Route to get a game by id
route.get('/:id', game_controller_1.getGameById);
// Route to add a game
route.post('/', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_game_1.AddGameZodSchema), game_controller_1.addGame);
// Route to get games by filter
route.post('/filter', (0, handle_validation_1.validateReq)(games_filter_1.GamesFilterZodSchema), game_controller_1.filterGames);
// Route to bulk add games
route.post('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(json_upload_config_1.default, 'gameDataFile'), (0, handle_json_file_validation_1.ValidateJsonFile)(bulk_add_1.BulkAddGameZodSchema), game_controller_1.bulkAddGames);
//Route to bulk delete games
route.delete('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(bulk_delete_1.BulkDeleteGameZodSchema), game_controller_1.bulkDeleteGames);
// Route to delete a game by id
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), game_controller_1.deleteGameById);
// Route to update a game by id
route.patch('/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_game_1.UpdateGameZodSchema), game_controller_1.updateGameById);
//export all the routes
exports.default = route;
