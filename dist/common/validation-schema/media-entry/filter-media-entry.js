"use strict";
/**
 * @file contains the validation schema used in filtering user media entries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterMediaEntrySchema = void 0;
const zod_1 = require("zod");
const model_constants_1 = require("../../constants/model.constants");
const config_constants_1 = require("../../constants/config.constants");
//schema
exports.FilterMediaEntrySchema = zod_1.z
    .object({
    onModel: zod_1.z
        .string({
        invalid_type_error: 'On model must be string',
    })
        .refine((val) => model_constants_1.MEDIA_ENTRY_MODELS.includes(val), {
        message: `On model must be one of the following: ${model_constants_1.MEDIA_ENTRY_MODELS.join(', ')}`,
    })
        .optional(),
    status: zod_1.z
        .string({
        invalid_type_error: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_ENTRY_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_ENTRY_STATUS.join(', ')}`,
    })
        .optional(),
    rating: zod_1.z
        .number({
        message: 'Rating must be number',
    })
        .min(0, 'Rating cannot be negative')
        .max(10, 'Rating cannot be greater than 10')
        .optional(),
    sortBy: zod_1.z
        .string({
        invalid_type_error: 'Sort by must be string',
    })
        .refine((val) => config_constants_1.MEDIA_ENTRY_SORT_FILTERS.includes(val), {
        message: `Sort by must be one of the following: ${config_constants_1.MEDIA_ENTRY_SORT_FILTERS.join(', ')}`,
    })
        .default('createdAt'),
    sortOrder: zod_1.z
        .enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'Sort order must be asc or desc' }),
    })
        .optional()
        .default('desc'),
    limit: zod_1.z
        .number({
        message: 'Limit must be number',
    })
        .min(1)
        .optional(),
    page: zod_1.z
        .number({
        message: 'Page must be number',
    })
        .min(1)
        .default(1),
})
    .default({});
