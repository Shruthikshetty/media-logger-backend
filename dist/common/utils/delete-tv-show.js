"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTvShow = void 0;
const tv_season_1 = __importDefault(require("../../models/tv-season"));
const api_error_1 = require("./api-error");
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const tv_show_model_1 = __importDefault(require("../../models/tv-show.model"));
/**
 * Deletes a tv show by id along with all its associated seasons and episodes.
 *
 * @param {string} tvShowId - The id of the tv show to delete.
 * @param {ClientSession} session - The mongoose session to use for the deletion.
 *
 * @returns An object containing the number of tv shows, seasons and episodes deleted.
 *
 * @throws {ApiError} - If the tv show is not found, a 404 error is thrown.
 */
const deleteTvShow = async (tvShowId, session) => {
    //find and delete all the seasons by tv tv id
    const seasons = await tv_season_1.default.find({ tvShow: tvShowId }).lean().exec();
    let episodeDeleteCount = 0;
    let seasonDeleteCount = 0;
    if (seasons.length > 0) {
        //delete all the episodes by season id
        for (const season of seasons) {
            const deletedEpisodes = await tv_episode_1.default.deleteMany({ season: season._id }, { session });
            episodeDeleteCount += deletedEpisodes.deletedCount;
        }
        //delete all the seasons by tv show id
        const deletedSeason = await tv_season_1.default.deleteMany({ tvShow: tvShowId }, { session });
        seasonDeleteCount = deletedSeason.deletedCount;
    }
    //delete the tv show by id
    const deletedTvShow = await tv_show_model_1.default.findByIdAndDelete(tvShowId, { session })
        .lean()
        .exec();
    // in case tv show is not deleted
    if (!deletedTvShow) {
        throw new api_error_1.ApiError(404, `TV show with id ${tvShowId} not found`);
    }
    return {
        deletedCount: {
            tvShow: 1,
            seasons: seasonDeleteCount,
            episodes: episodeDeleteCount,
        },
    };
};
exports.deleteTvShow = deleteTvShow;
