"use strict";
/**
 * @file contains all the controllers related to discover route
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscoverTVSeries = exports.getDiscoverMovies = exports.getDiscoverGames = void 0;
const config_constants_1 = require("../common/constants/config.constants");
const game_model_1 = __importDefault(require("../models/game.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const tv_show_model_1 = __importDefault(require("../models/tv-show.model"));
const get_discover_media_1 = require("../common/utils/get-discover-media");
// controller to get discover games
const getDiscoverGames = async (req, res) => (0, get_discover_media_1.getDiscoverItems)(req, res, {
    MediaModel: game_model_1.default,
    onModel: 'Game',
    mediaKey: 'games',
    limits: config_constants_1.GET_ALL_GAMES_LIMITS,
});
exports.getDiscoverGames = getDiscoverGames;
// controller to get discover movies
const getDiscoverMovies = async (req, res) => (0, get_discover_media_1.getDiscoverItems)(req, res, {
    MediaModel: movie_model_1.default,
    onModel: 'Movie',
    mediaKey: 'movies',
    limits: config_constants_1.GET_ALL_MOVIES_LIMITS,
});
exports.getDiscoverMovies = getDiscoverMovies;
// controller to get discover tv series
const getDiscoverTVSeries = async (req, res) => (0, get_discover_media_1.getDiscoverItems)(req, res, {
    MediaModel: tv_show_model_1.default,
    onModel: 'TVShow',
    mediaKey: 'tvShows',
    limits: config_constants_1.GET_ALL_TV_SHOW_LIMITS,
});
exports.getDiscoverTVSeries = getDiscoverTVSeries;
