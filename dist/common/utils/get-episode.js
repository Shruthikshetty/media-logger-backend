"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodeDetailsById = void 0;
const tv_episode_1 = __importDefault(require("../../models/tv-episode"));
const api_error_1 = require("./api-error");
const mongo_errors_1 = require("./mongo-errors");
/**
 * @description Get an episode by its id. If fullDetails is true, it will also
 *              populate the season and tvShow fields.
 * @param {string} episodeId - The id of the episode
 * @param {string} [fullDetails='false'] - Whether to populate season and tvShow fields
 * @returns The episode details
 */
const getEpisodeDetailsById = async (episodeId, fullDetails = 'false') => {
    // check if id is a valid mongo id
    if (!(0, mongo_errors_1.isMongoIdValid)(episodeId)) {
        throw new api_error_1.ApiError(400, 'Invalid episode id');
    }
    switch (fullDetails) {
        case 'true':
            return await tv_episode_1.default.findById(episodeId)
                .populate({
                path: 'season',
                populate: {
                    path: 'tvShow',
                },
            })
                .lean()
                .exec();
        default:
            return await tv_episode_1.default.findById(episodeId).lean().exec();
    }
};
exports.getEpisodeDetailsById = getEpisodeDetailsById;
