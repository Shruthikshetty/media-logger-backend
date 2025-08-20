"use strict";
/**
 * @file contains zod schema for adding a tv-show
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTvShowZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const model_constants_1 = require("../../constants/model.constants");
const add_season_1 = require("./add-season");
//schema
exports.AddTvShowZodSchema = zod_1.default.object({
    title: zod_1.default.string({
        required_error: 'Title is required',
        message: 'Title must be string',
    }),
    description: zod_1.default.string({
        required_error: 'Description is required',
        message: 'Description must be string',
    }),
    averageRating: zod_1.default
        .number({
        message: 'Average rating must be number',
    })
        .max(10, 'Average rating can be at most 10')
        .optional(),
    genre: zod_1.default.array(zod_1.default
        .string({
        message: 'Genre must be string',
    })
        .refine((val) => {
        return model_constants_1.GENRE_MOVIE_TV.includes(val);
    }, {
        message: `Genre must be one of the following: ${model_constants_1.GENRE_MOVIE_TV.join(', ')}`,
    }), {
        required_error: 'Genre is required',
        message: 'Genre must be an array of strings',
    }),
    releaseDate: zod_1.default
        .string({
        required_error: 'Release date is required',
        message: 'Release date must be string',
    })
        .datetime({
        message: 'Release date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    })
        .transform((val) => new Date(val)),
    cast: zod_1.default
        .array(zod_1.default.string({ message: 'Cast must be string' }), {
        message: 'Cast must be an array of strings',
    })
        .optional(),
    directors: zod_1.default.array(zod_1.default.string({ message: 'Directors must be string' }), {
        message: 'Directors must be an array of strings',
    }),
    runTime: zod_1.default.number({
        required_error: 'Run time is required',
        message: 'Run time must be number (in minutes)',
    }),
    languages: zod_1.default
        .array(zod_1.default
        .string({ message: 'Languages must be string' })
        .transform((val) => val.toLowerCase()), {
        message: 'Languages must be an array of strings',
    })
        .optional(),
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
        message: 'Status must be boolean',
    })
        .optional()
        .default(true),
    status: zod_1.default
        .string({
        required_error: 'Status is required',
        message: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_STATUS.join(', ')}`,
    }),
    tags: zod_1.default
        .array(zod_1.default
        .string({ message: 'Tags must be string' })
        .refine((val) => model_constants_1.TAGS.includes(val), {
        message: `Tags must be one of the following: ${model_constants_1.TAGS.join(', ')}`,
    }), { message: 'Tags must be an array of strings' })
        .optional(),
    totalSeasons: zod_1.default.number({
        required_error: 'Total seasons is required',
        message: 'Total seasons must be number',
    }),
    totalEpisodes: zod_1.default.number({
        required_error: 'Total episodes is required',
        message: 'Total episodes must be number',
    }),
    ageRating: zod_1.default
        .number({
        message: 'Age rating must be number',
    })
        .optional(),
    seasons: zod_1.default.array(add_season_1.AddSeasonZodSchema.omit({ tvShow: true })).optional(),
});
