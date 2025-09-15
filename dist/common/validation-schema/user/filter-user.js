"use strict";
/**
 * This @file contains the validation schema for filtering users
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterUserZodSchema = void 0;
const zod_1 = require("zod");
const model_constants_1 = require("../../constants/model.constants");
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
});
