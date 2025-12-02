"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSingleTvShow = void 0;
const tv_show_model_1 = __importDefault(require("../../models/tv-show.model"));
const api_error_1 = require("./api-error");
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const tv_season_1 = __importDefault(require("../../models/tv-season"));
/**
 * Adds a single tv show to the database along with its seasons and episodes if present
 * @param {AddTvShowZodType} tvShowData - The data to be saved for the tv show pass the validated data.
 * @param {ClientSession} session - The mongoose session to be used for the transaction.
 * @returns - The saved tv show with its seasons and episodes if present.
 * @throws {ApiError} - If the tv show is not saved, a 500 error is thrown.
 * @throws {ApiError} - If a season is not saved, a 500 error is thrown.
 * @throws {ApiError} - If an episode is not saved, a 500 error is thrown.
 */
const addSingleTvShow = async (tvShowData, session) => {
    //destructure the season and rest of the tv show details
    const { seasons, ...restTvDetails } = tvShowData;
    // create a new tv show
    const newTvShow = new tv_show_model_1.default(restTvDetails);
    // save the tv show
    const saveTvShow = await newTvShow.save({ session });
    // in case tv show is not saved
    if (!saveTvShow) {
        throw new api_error_1.ApiError(500, 'Tv show creation failed');
    }
    // in case there are seasons
    let savedSeasons = [];
    let savedEpisodes = [];
    if (seasons && seasons.length > 0) {
        for (const seasonData of seasons) {
            // extract episodes
            const { episodes, ...seasonDetails } = seasonData;
            // create a new season
            const newSeason = new tv_season_1.default({
                tvShow: saveTvShow._id,
                ...seasonDetails,
            });
            // save the season
            const savedSeason = await newSeason.save({ session });
            // in case season is not saved
            if (!savedSeason) {
                throw new api_error_1.ApiError(500, `${seasonData.title} creation failed`);
            }
            savedSeasons.push(savedSeason);
            // in case there are episodes
            if (episodes && episodes.length > 0) {
                for (const episodeData of episodes) {
                    // create a new episode
                    const newEpisode = new tv_episode_1.default({
                        season: savedSeason._id,
                        ...episodeData,
                    });
                    // save the episode
                    const savedEpisode = await newEpisode.save({ session });
                    if (!savedEpisode) {
                        throw new api_error_1.ApiError(500, `${episodeData.title} creation failed`);
                    }
                    savedEpisodes.push(savedEpisode);
                }
            }
        }
    }
    /**
     * return the saved tv show with seasons and episodes
     * {
     *  ...,
     *  seasons:[
     *    {
     *    ...,
     *    episodes:[
     *      ...
     *    }
     *  ]
     * }
     */
    return {
        ...saveTvShow.toObject(),
        seasons: savedSeasons.map((season) => ({
            ...season.toObject(),
            episodes: savedEpisodes.filter((episode) => episode.season.toString() === season.toObject()._id.toString()),
        })),
    };
};
exports.addSingleTvShow = addSingleTvShow;
