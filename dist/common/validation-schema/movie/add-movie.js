"use strict";
/**
 * @file contains zod schema for adding movies
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMovieZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.AddMovieZodSchema = zod_1.default.object({
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
    cast: zod_1.default
        .array(zod_1.default.string({ message: 'Cast must be string' }), {
        message: 'Cast must be an array of strings',
    })
        .default([])
        .optional(),
    directors: zod_1.default
        .array(zod_1.default.string({ message: 'Directors must be string' }), {
        message: 'Directors must be an array of strings',
    })
        .default([])
        .optional(),
    runTime: zod_1.default.number({
        required_error: 'Run time is required',
        message: 'Run time must be number',
    }),
    languages: zod_1.default
        .array(zod_1.default
        .string({ message: 'Languages must be string' })
        .transform((val) => val.toLocaleLowerCase()), {
        required_error: 'Languages is required',
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
        message: 'Is active must be boolean',
    })
        .default(true)
        .optional(),
    status: zod_1.default
        .string({
        required_error: 'Status is required',
        message: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_STATUS.join(', ')}`,
    })
        .optional(),
    tags: zod_1.default
        .array(zod_1.default
        .string({ message: 'Tags must be string' })
        .refine((val) => model_constants_1.TAGS.includes(val), {
        message: `Tags must be one of the following: ${model_constants_1.TAGS.join(', ')}`,
    }), {
        message: 'Tags must be an array of strings',
    })
        .optional(),
    ageRating: zod_1.default.number({
        message: 'Age rating must be number',
    }),
    trailerYoutubeUrl: zod_1.default
        .string({
        message: 'Trailer youtube url must be string',
    })
        .optional(),
    releaseDate: zod_1.default
        .string({
        required_error: 'Release date is required',
        message: 'Release date must be string in ISO format',
    })
        .datetime({
        message: 'Release date must be a valid ISO 8601 string (e.g., "2024-01-01T00:00:00.000Z")',
    })
        .transform((val) => new Date(val)),
});
