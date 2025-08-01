"use strict";
/**
 * @file contains all the validation schema for updating a season
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeasonZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const add_season_1 = require("./add-season");
//schema
exports.UpdateSeasonZodSchema = add_season_1.AddSeasonZodSchema.omit({ episodes: true })
    .partial()
    .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: 'At least one field must be updated',
            path: [],
        });
    }
});
