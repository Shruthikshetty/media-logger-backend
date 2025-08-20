"use strict";
/**
 * @file contains the validation schema for update movie
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMoveZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const add_movie_1 = require("./add-movie");
exports.updateMoveZodSchema = add_movie_1.AddMovieZodSchema.partial().superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: 'At least one field must be updated',
            path: [],
        });
    }
});
