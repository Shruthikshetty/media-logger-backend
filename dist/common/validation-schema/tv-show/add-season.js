"use strict";
/**
 * @file contains zod schema for add a season to a tv-show
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSeasonZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongo_errors_1 = require("../../utils/mongo-errors");
const model_constants_1 = require("../../constants/model.constants");
const add_episode_1 = require("./add-episode");
// schema
exports.AddSeasonZodSchema = zod_1.default.object({
    tvShow: zod_1.default
        .string({
        required_error: 'Tv show id is required',
        message: 'Tv show id must be string',
    })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), { message: 'Invalid tv show id' }),
    seasonNumber: zod_1.default.number({
        required_error: 'Season number is required',
        message: 'Season number must be number',
    }),
    title: zod_1.default.string({
        required_error: 'Title is required',
        message: 'Title must be string',
    }),
    description: zod_1.default
        .string({
        message: 'Description must be string',
    })
        .optional(),
    releaseDate: zod_1.default
        .string({
        message: 'Release date must be  iso date string',
    })
        .datetime({ message: 'Release date must be in iso format' })
        .transform((val) => new Date(val))
        .optional(),
    noOfEpisodes: zod_1.default.number({
        required_error: 'No of episodes is required',
        message: 'No of episodes must be number',
    }),
    posterUrl: zod_1.default
        .string({
        message: 'Poster url must be string',
    })
        .optional(),
    status: zod_1.default
        .string({
        required_error: 'Status is required',
        message: 'Status must be string',
    })
        .refine((val) => model_constants_1.SEASON_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.SEASON_STATUS.join(', ')}`,
    }),
    youtubeVideoId: zod_1.default
        .string({
        message: 'Youtube id must be string',
    })
        .optional(),
    averageRating: zod_1.default
        .number({
        message: 'Average rating must be a number',
    })
        .min(0, { message: 'Rating cannot be negative' })
        .max(10, { message: 'Rating cannot be greater than 10' })
        .optional(),
    episodes: zod_1.default.array(add_episode_1.AddEpisodeZodSchema.omit({ season: true })).optional(),
});
