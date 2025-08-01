"use strict";
/**
 * this @file contains the validation schema for bulk delete movies
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkDeleteMovieZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongo_errors_1 = require("../../utils/mongo-errors");
//schema
exports.BulkDeleteMovieZodSchema = zod_1.default.object({
    movieIds: zod_1.default
        .array(zod_1.default
        .string({ required_error: 'Movie ids are required' })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), { message: 'Invalid movie id' }))
        .min(1, 'At least one movie id is required'),
});
