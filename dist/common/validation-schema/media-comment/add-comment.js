"use strict";
/**
 * @file contains the validation schema for adding media comments
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMediaCommentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongo_errors_1 = require("../../utils/mongo-errors");
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.AddMediaCommentSchema = zod_1.default.object({
    entityId: zod_1.default
        .string({
        required_error: 'Entity id is required',
        invalid_type_error: 'Entity id must be string',
    })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), {
        message: 'Invalid entity id',
    }),
    entityType: zod_1.default
        .string({
        required_error: 'Entity type is required',
        invalid_type_error: 'Entity type must be string',
    })
        .refine((val) => model_constants_1.HISTORY_ENTITY.includes(val), {
        message: `Entity type must be one of the following: ${model_constants_1.HISTORY_ENTITY.join(', ')}`,
    }),
    comment: zod_1.default
        .string({
        required_error: 'Comment is required',
        invalid_type_error: 'Comment must be string',
    })
        .trim()
        .min(1, { message: 'Comment cannot be empty' })
        .max(5000, { message: 'Comment must be 5000 characters or less' }),
});
