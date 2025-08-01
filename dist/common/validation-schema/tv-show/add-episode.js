"use strict";
/**
 * @file contains zod schema for adding a episode to a season
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEpisodeZodSchema = void 0;
//import zod
const zod_1 = __importDefault(require("zod"));
const mongo_errors_1 = require("../../utils/mongo-errors");
//schema
exports.AddEpisodeZodSchema = zod_1.default.object({
    season: zod_1.default
        .string({
        required_error: 'Season ref id is required',
        message: 'Season red id must be string',
    })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), { message: 'Invalid season id' }),
    title: zod_1.default.string({
        required_error: 'Title is required',
        message: 'Title must be string',
    }),
    description: zod_1.default
        .string({
        message: 'Description must be string',
    })
        .optional(),
    episodeNumber: zod_1.default.number({
        required_error: 'Episode number is required',
        message: 'Episode number must be number',
    }),
    releaseDate: zod_1.default
        .string({
        message: 'Release date must be  iso date string',
    })
        .optional(),
    runTime: zod_1.default.number({
        required_error: 'Run time is required',
        message: 'Run time must be number (minutes)',
    }),
});
