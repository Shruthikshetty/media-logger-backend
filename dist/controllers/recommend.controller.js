"use strict";
/**
 * @file contains all the controllers related to recommendation routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarTvShow = exports.getSimilarMovies = exports.getSimilarGames = exports.getHealth = void 0;
const endpoints_constants_1 = require("../common/constants/endpoints.constants");
const axios_1 = __importDefault(require("axios"));
const config_constants_1 = require("../common/constants/config.constants");
const handle_error_1 = require("../common/utils/handle-error");
const game_model_1 = __importDefault(require("../models/game.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const tv_show_model_1 = __importDefault(require("../models/tv-show.model"));
const get_similar_media_1 = require("../common/utils/get-similar-media");
//check the health of the recommendation ms
const getHealth = async (_req, res) => {
    try {
        //get the health from the recommendation ms
        const response = await axios_1.default.get(endpoints_constants_1.Endpoints.recommender.health, {
            timeout: config_constants_1.RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT,
            // Let all HTTP statuses resolve so we can handle non‑200 explicitly
            validateStatus: () => true,
        });
        // if we receive a 200 status code
        if (response.status === 200) {
            res.status(200).json({
                success: true,
                message: 'recommender service is running',
            });
            return;
        }
        // in case we don't get a success response
        res.status(500).json({
            success: false,
            message: 'recommender service is down',
        });
    }
    catch (err) {
        // handle time out error
        if (axios_1.default.isAxiosError(err) && err.code === 'ECONNABORTED') {
            (0, handle_error_1.handleError)(res, {
                statusCode: 504,
                message: 'recommender service is down',
            });
            return;
        }
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getHealth = getHealth;
//recommend similar games
const getSimilarGames = async (req, res) => {
    await (0, get_similar_media_1.getSimilarMedia)(req, res, {
        endpoint: endpoints_constants_1.Endpoints.recommender.games,
        mediaType: 'game',
        model: game_model_1.default,
        responseField: 'similar_games',
    });
};
exports.getSimilarGames = getSimilarGames;
//recommend similar movies
const getSimilarMovies = async (req, res) => {
    await (0, get_similar_media_1.getSimilarMedia)(req, res, {
        endpoint: endpoints_constants_1.Endpoints.recommender.movies,
        mediaType: 'movie',
        model: movie_model_1.default,
        responseField: 'similar_movies',
    });
};
exports.getSimilarMovies = getSimilarMovies;
//recommend similar tv show
const getSimilarTvShow = async (req, res) => {
    await (0, get_similar_media_1.getSimilarMedia)(req, res, {
        endpoint: endpoints_constants_1.Endpoints.recommender.shows,
        mediaType: 'tv show',
        model: tv_show_model_1.default,
        responseField: 'similar_tv_shows',
    });
};
exports.getSimilarTvShow = getSimilarTvShow;
