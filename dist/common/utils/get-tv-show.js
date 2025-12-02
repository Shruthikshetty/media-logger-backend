"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTvShowDetails = exports.getSeasonsWithEpisodes = void 0;
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const tv_season_1 = __importDefault(require("../../models/tv-season"));
const tv_show_model_1 = __importDefault(require("../../models/tv-show.model"));
/**
 * @description Get seasons with their episodes for a given TV show
 * @param {ObjectId} tvShowId - The ID of the TV show
 * @returns {Promise<Array>} An array of seasons with nested episodes
 */
const getSeasonsWithEpisodes = async (tvShowId) => {
    // Find all seasons for this TV show
    const seasons = await tv_season_1.default.find({ tvShow: tvShowId }).lean().exec();
    // Add episodes to each season
    const seasonsWithEpisodes = await Promise.all(seasons.map(async (season) => {
        const episodes = await tv_episode_1.default.find({ season: season._id }).lean().exec();
        return {
            ...season,
            episodes,
        };
    }));
    return seasonsWithEpisodes;
};
exports.getSeasonsWithEpisodes = getSeasonsWithEpisodes;
/**
 * @description Get all the TV shows with pagination, with optional full details
 *              of seasons and episodes.
 * @param {string} fullDetails - Whether to include full details of seasons and
 *                              episodes.
 * @param {number} start - The page number to start from.
 * @param {number} limit - The number of items per page.
 * @returns  An array of TV shows and the total count of TV shows.
 */
const getTvShowDetails = async (fullDetails, start, limit) => {
    if (fullDetails === 'true') {
        // Get all the TV shows with additional details of seasons and episodes
        const [tvShows, total] = await Promise.all([
            tv_show_model_1.default.find().skip(start).limit(limit).lean().exec(),
            tv_show_model_1.default.countDocuments(),
        ]);
        // Process each TV show to add nested seasons and episodes
        const tvShowsWithDetails = await Promise.all(tvShows.map(async (tvShow) => {
            const seasonsWithEpisodes = await (0, exports.getSeasonsWithEpisodes)(tvShow._id);
            return {
                ...tvShow,
                seasons: seasonsWithEpisodes,
            };
        }));
        return [tvShowsWithDetails, total];
    }
    else {
        // get all the tv shows without additional details
        const [tvShows, total] = await Promise.all([
            tv_show_model_1.default.find().skip(start).limit(limit).lean().exec(),
            tv_show_model_1.default.countDocuments(),
        ]);
        return [tvShows, total];
    }
};
exports.getTvShowDetails = getTvShowDetails;
