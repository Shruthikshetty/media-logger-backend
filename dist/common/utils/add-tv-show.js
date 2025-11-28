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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const addSingleTvShow = (tvShowData, session) => __awaiter(void 0, void 0, void 0, function* () {
    //destructure the season and rest of the tv show details
    const { seasons } = tvShowData, restTvDetails = __rest(tvShowData, ["seasons"]);
    // create a new tv show
    const newTvShow = new tv_show_model_1.default(restTvDetails);
    // save the tv show
    const saveTvShow = yield newTvShow.save({ session });
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
            const { episodes } = seasonData, seasonDetails = __rest(seasonData, ["episodes"]);
            // create a new season
            const newSeason = new tv_season_1.default(Object.assign({ tvShow: saveTvShow._id }, seasonDetails));
            // save the season
            const savedSeason = yield newSeason.save({ session });
            // in case season is not saved
            if (!savedSeason) {
                throw new api_error_1.ApiError(500, `${seasonData.title} creation failed`);
            }
            savedSeasons.push(savedSeason);
            // in case there are episodes
            if (episodes && episodes.length > 0) {
                for (const episodeData of episodes) {
                    // create a new episode
                    const newEpisode = new tv_episode_1.default(Object.assign({ season: savedSeason._id }, episodeData));
                    // save the episode
                    const savedEpisode = yield newEpisode.save({ session });
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
    return Object.assign(Object.assign({}, saveTvShow.toObject()), { seasons: savedSeasons.map((season) => (Object.assign(Object.assign({}, season.toObject()), { episodes: savedEpisodes.filter((episode) => episode.season.toString() === season.toObject()._id.toString()) }))) });
});
exports.addSingleTvShow = addSingleTvShow;
