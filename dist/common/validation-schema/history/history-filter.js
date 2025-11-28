"use strict";
/**
 * @file contains the validation schema for history filter
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryFilterZodSchema = void 0;
const zod_1 = require("zod");
const config_constants_1 = require("../../constants/config.constants");
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.HistoryFilterZodSchema = zod_1.z
    .object({
    action: zod_1.z
        .string({
        message: 'Action must be string',
    })
        .refine((val) => model_constants_1.HISTORY_ACTION.includes(val), {
        message: `Action must be one of the following: ${model_constants_1.HISTORY_ACTION.join(', ')}`,
    })
        .optional(),
    entityType: zod_1.z
        .string({
        message: 'Entity type must be string',
    })
        .refine((val) => model_constants_1.HISTORY_ENTITY.includes(val), {
        message: `Entity type must be one of the following: ${model_constants_1.HISTORY_ENTITY.join(', ')}`,
    })
        .optional(),
    bulk: zod_1.z
        .boolean({
        message: 'Bulk must be boolean',
    })
        .optional(),
    fullDetails: zod_1.z
        .boolean({
        message: 'Full details must be boolean',
    })
        .default(false),
    limit: zod_1.z
        .number({
        message: 'Limit must be number',
    })
        .int()
        .max(config_constants_1.GET_ALL_HISTORY_LIMITS.limit.max)
        .min(config_constants_1.GET_ALL_HISTORY_LIMITS.limit.min)
        .default(config_constants_1.GET_ALL_HISTORY_LIMITS.limit.default),
    start: zod_1.z
        .number({
        message: 'Start must be number',
    })
        .int()
        .min(config_constants_1.GET_ALL_HISTORY_LIMITS.start.min)
        .default(config_constants_1.GET_ALL_HISTORY_LIMITS.start.default),
    page: zod_1.z
        .number({
        message: 'Page must be number',
    })
        .int()
        .min(1)
        .optional(),
})
    .default({});
