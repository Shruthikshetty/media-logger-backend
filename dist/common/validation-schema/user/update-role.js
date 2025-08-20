"use strict";
/**
 * @file contains the validation schema for updating user role
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.UpdateRoleZodSchema = zod_1.default.object({
    role: zod_1.default
        .string({
        required_error: 'Role is required',
        message: 'Role must be string',
    })
        .refine((val) => model_constants_1.USER_ROLES.includes(val), {
        message: `Role must be one of the following: ${model_constants_1.USER_ROLES.join(', ')}`,
    }),
});
