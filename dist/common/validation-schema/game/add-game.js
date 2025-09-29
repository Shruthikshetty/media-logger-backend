"use strict";
/**
 * this @file contains the validation schema from adding a game
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGameZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const model_constants_1 = require("../../constants/model.constants");
exports.AddGameZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({
        required_error: 'Title is required',
        message: 'Title must be string',
    })
        .min(3, 'Title must be at least 3 characters long'),
    description: zod_1.default
        .string({
        required_error: 'Description is required',
        message: 'Description must be string',
    })
        .min(3, 'Description must be at least 3 characters long'),
    averageRating: zod_1.default
        .number({
        message: 'Average rating must be number',
    })
        .min(0, {
        message: 'Average rating must be greater than or equal to 0',
    })
        .max(10, {
        message: 'Average rating must be less than or equal to 10',
    })
        .optional(),
    genre: zod_1.default.array(zod_1.default
        .string({
        required_error: 'Genre is required',
        message: 'Genre must be string',
    })
        .refine((val) => {
        return model_constants_1.GAME_GENRES.includes(val);
    }, {
        message: `Genre must be one of the following: ${model_constants_1.GAME_GENRES.join(', ')}`,
    }), {
        message: 'Genre must be an array of strings',
    }),
    releaseDate: zod_1.default
        .string({
        required_error: 'Release date is required',
        message: 'Release date must be date string in iso format',
    })
        .datetime({ message: 'Release date must be in iso format' })
        .transform((val) => new Date(val)),
    posterUrl: zod_1.default
        .string({
        message: 'Poster url must be string',
    })
        .optional(),
    backdropUrl: zod_1.default
        .string({
        message: 'Backdrop url must be string',
    })
        .optional(),
    isActive: zod_1.default
        .boolean({
        message: 'Is active must be boolean',
    })
        .optional()
        .default(true),
    status: zod_1.default
        .string({
        required_error: 'Status is required',
        message: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_STATUS.join('| ')}`,
    }),
    platforms: zod_1.default.array(zod_1.default
        .string({ message: 'Platforms must be string' })
        .refine((val) => model_constants_1.GAME_PLATFORMS.includes(val), {
        message: `Platforms must be one of the following: ${model_constants_1.GAME_PLATFORMS.join(', ')}`,
    }), {
        message: 'Platforms must be an array of strings',
    }),
    avgPlaytime: zod_1.default
        .number({
        message: 'Average playtime must be number',
    })
        .optional(),
    developer: zod_1.default
        .string({
        message: 'Developer must be string',
    })
        .optional(),
    ageRating: zod_1.default
        .number({
        message: 'Age rating must be number',
    })
        .optional(),
    youtubeVideoId: zod_1.default
        .string({
        message: 'Trailer youtube url must be string',
    })
        .optional(),
});
