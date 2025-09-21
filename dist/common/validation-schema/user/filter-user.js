"use strict";
/**
 * This @file contains the validation schema for filtering users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterUserZodSchema = void 0;
const zod_1 = require("zod");
const model_constants_1 = require("../../constants/model.constants");
const config_constants_1 = require("../../constants/config.constants");
//schema
exports.FilterUserZodSchema = zod_1.z.object({
    role: zod_1.z
        .string({
        message: 'Role must be string',
    })
        .refine((val) => model_constants_1.USER_ROLES.includes(val), {
        message: `Role must be one of the following: ${model_constants_1.USER_ROLES.join(', ')}`,
    })
        .optional(),
    searchText: zod_1.z
        .string({
        message: 'Search text must be string',
    })
        .optional(),
    limit: zod_1.z
        .number({
        message: 'Limit must be number',
    })
        .int()
        .max(config_constants_1.GET_ALL_USER_LIMITS.limit.max)
        .min(config_constants_1.GET_ALL_USER_LIMITS.limit.min)
        .default(config_constants_1.GET_ALL_USER_LIMITS.limit.default),
    page: zod_1.z
        .number({
        message: 'Page must be number',
    })
        .int()
        .min(1)
        .default(1),
});
