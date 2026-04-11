"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMediaEntrySchema = void 0;
/**
 * @file contains the validation schema for adding a media entry
 */
const zod_1 = require("zod");
const mongo_errors_1 = require("../../utils/mongo-errors");
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.AddMediaEntrySchema = zod_1.z.object({
    mediaItem: zod_1.z
        .string({
        required_error: 'Media item is required',
        invalid_type_error: 'Media item must be string',
    })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), {
        message: 'Invalid media item id',
    }),
    onModel: zod_1.z
        .string({
        required_error: 'On model is required',
        invalid_type_error: 'On model must be string',
    })
        .refine((val) => model_constants_1.MEDIA_ENTRY_MODELS.includes(val), {
        message: `On model must be one of the following: ${model_constants_1.MEDIA_ENTRY_MODELS.join(', ')}`,
    }),
    status: zod_1.z
        .string({
        required_error: 'Status is required',
        invalid_type_error: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_ENTRY_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_ENTRY_STATUS.join(', ')}`,
    }),
    rating: zod_1.z
        .number({
        message: 'Rating must be number',
    })
        .min(0, 'Rating cannot be negative')
        .max(10, 'Rating cannot be greater than 10')
        .optional(),
});
