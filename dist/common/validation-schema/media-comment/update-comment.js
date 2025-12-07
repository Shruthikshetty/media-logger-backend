"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMediaCommentSchema = void 0;
/**
 * @file contains schema for updating a media comment
 */
const zod_1 = __importDefault(require("zod"));
exports.UpdateMediaCommentSchema = zod_1.default.object({
    comment: zod_1.default
        .string({
        required_error: 'Comment is required',
        invalid_type_error: 'Comment must be string',
    })
        .trim()
        .min(1, { message: 'Comment cannot be empty' })
        .max(5000, { message: 'Comment must be 5000 characters or less' }),
});
