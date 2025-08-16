'use strict';
/**
 * This will combine all the routes to be imported in the index
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const user_route_1 = __importDefault(require('./user.route'));
const auth_route_1 = __importDefault(require('./auth.route'));
const movie_route_1 = __importDefault(require('./movie.route'));
const game_route_1 = __importDefault(require('./game.route'));
const tv_show_route_1 = __importDefault(require('./tv-show.route'));
//initialize router
const route = (0, express_1.Router)();
//User routes
route.use('/user', user_route_1.default);
//Auth routes
route.use('/auth', auth_route_1.default);
//Movie routes
route.use('/movie', movie_route_1.default);
//Game routes
route.use('/game', game_route_1.default);
//TV Show routes
route.use('/tv-show', tv_show_route_1.default);
// export all the routes
exports.default = route;
