"use strict";
/**
 * @file contains the validation schema for updating an episode
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEpisodeZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const add_episode_1 = require("./add-episode");
//schema
exports.UpdateEpisodeZodSchema = add_episode_1.AddEpisodeZodSchema.partial().superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: 'At least one field must be updated',
            path: [],
        });
    }
});
