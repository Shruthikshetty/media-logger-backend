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
const getSeasonDetailsById = (seasonId_1, ...args_1) => __awaiter(void 0, [seasonId_1, ...args_1], void 0, function* (seasonId, fullDetails = 'false') {
    // check if id is a valid mongo id
    if (!(0, mongo_errors_1.isMongoIdValid)(seasonId))
        throw new api_error_1.ApiError(400, 'Invalid season id');
    // get the season details
    switch (fullDetails) {
        case 'true': {
            const [season, episode] = yield Promise.all([
                tv_season_1.default.findById(seasonId).lean().exec(),
                tv_episode_1.default.find({ season: seasonId }).lean().exec(),
            ]);
            tv_season_1.default.findById(seasonId).lean().exec();
            // return the season with the episodes
            return Object.assign(Object.assign({}, season), { episodes: episode });
        }
        default:
            return yield tv_season_1.default.findById(seasonId).lean().exec();
    }
});
exports.getSeasonDetailsById = getSeasonDetailsById;
