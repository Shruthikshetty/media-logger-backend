"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTvShow = void 0;
const tv_season_1 = __importDefault(require("../../models/tv-season"));
const api_error_1 = require("./api-error");
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const tv_show_mode_1 = __importDefault(require("../../models/tv-show.mode"));
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
const deleteTvShow = (tvShowId, session) => __awaiter(void 0, void 0, void 0, function* () {
    //find and delete all the seasons by tv tv id
    const seasons = yield tv_season_1.default.find({ tvShow: tvShowId }).lean().exec();
    let episodeDeleteCount = 0;
    let seasonDeleteCount = 0;
    if (seasons.length > 0) {
        //delete all the episodes by season id
        for (const season of seasons) {
            const deletedEpisodes = yield tv_episode_1.default.deleteMany({ season: season._id }, { session });
            episodeDeleteCount += deletedEpisodes.deletedCount;
        }
        //delete all the seasons by tv show id
        const deletedSeason = yield tv_season_1.default.deleteMany({ tvShow: tvShowId }, { session });
        seasonDeleteCount = deletedSeason.deletedCount;
    }
    //delete the tv show by id
    const deletedTvShow = yield tv_show_mode_1.default.findByIdAndDelete(tvShowId, { session })
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
});
exports.deleteTvShow = deleteTvShow;
