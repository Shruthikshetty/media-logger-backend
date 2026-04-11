"use strict";
/**
 * @file contains all the routes related to discovery of media specific to user
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discover_controller_1 = require("../controllers/discover.controller");
const require_auth_1 = require("../common/middleware/require-auth");
//initialize router
const route = (0, express_1.Router)();
/**
 * @swagger
 * /api/discover/games:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch games with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         required: false
 *         type: integer
 *         default: 1
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverGamesSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/games', (0, require_auth_1.optionalAuth)(), discover_controller_1.getDiscoverGames);
/**
 * @swagger
 * /api/discover/movies:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch movies with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         required: false
 *         type: integer
 *         default: 1
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverMoviesSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/movies', (0, require_auth_1.optionalAuth)(), discover_controller_1.getDiscoverMovies);
/**
 * @swagger
 * /api/discover/tv-show:
 *   get:
 *     tags: [Discovery]
 *     summary: Fetch tv shows with populated user states .
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         default: 20
 *       - name: page
 *         in: query
 *         required: false
 *         type: integer
 *         default: 1
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/GetDiscoverTvShowSuccessResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
route.get('/tv-show', (0, require_auth_1.optionalAuth)(), discover_controller_1.getDiscoverTVSeries);
//export all routes
exports.default = route;
