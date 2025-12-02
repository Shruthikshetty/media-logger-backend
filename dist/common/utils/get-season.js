"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeasonDetailsById = void 0;
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const tv_season_1 = __importDefault(require("../../models/tv-season"));
const api_error_1 = require("./api-error");
const mongo_errors_1 = require("./mongo-errors");
/**
 * @description Get a season by its id. If fullDetails is true, it will also
 *              populate the episodes field.
 * @param {string} seasonId - The id of the season
 * @param {string} [fullDetails='false'] - Whether to populate episodes field
 * @returns The season details
 */
const getSeasonDetailsById = async (seasonId, fullDetails = 'false') => {
    // check if id is a valid mongo id
    if (!(0, mongo_errors_1.isMongoIdValid)(seasonId))
        throw new api_error_1.ApiError(400, 'Invalid season id');
    // get the season details
    switch (fullDetails) {
        case 'true': {
            const [season, episode] = await Promise.all([
                tv_season_1.default.findById(seasonId).lean().exec(),
                tv_episode_1.default.find({ season: seasonId }).lean().exec(),
            ]);
            tv_season_1.default.findById(seasonId).lean().exec();
            // return the season with the episodes
            return { ...season, episodes: episode };
        }
        default:
            return await tv_season_1.default.findById(seasonId).lean().exec();
    }
};
exports.getSeasonDetailsById = getSeasonDetailsById;
