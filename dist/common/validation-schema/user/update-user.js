"use strict";
/**
 * this @file contains the validation schema for update user
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const patterns_constants_1 = require("../../constants/patterns.constants");
//schema
exports.UpdateUserZodSchema = zod_1.default
    .object({
    name: zod_1.default
        .string({
        message: 'Name must be string',
    })
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters')
        .optional(),
    password: zod_1.default
        .string({
        message: 'Password must be string',
    })
        .optional(),
    bio: zod_1.default
        .string({
        message: 'Bio must be string',
    })
        .max(200, 'Bio can be at most 200 characters')
        .optional(),
    location: zod_1.default
        .string()
        .min(3, 'Location must be at least 3 characters')
        .max(50, 'Location must be at most 50 characters')
        .optional(),
    email: zod_1.default.string().regex(patterns_constants_1.Regex.email, 'Email is not valid').optional(),
    xp: zod_1.default.number().optional(),
    profileImg: zod_1.default.string().optional(),
})
    .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: 'At least one field must be provided',
            path: [], // attaches to the root object
        });
    }
});
