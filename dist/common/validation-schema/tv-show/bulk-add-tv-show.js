"use strict";
/**
 * @file holds the bulk add tv show validation schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAddTvShowZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const add_tv_show_1 = require("./add-tv-show");
//schema
exports.BulkAddTvShowZodSchema = zod_1.default
    .array(add_tv_show_1.AddTvShowZodSchema, {
    message: 'details must be an array of tv show objects',
})
    .min(1, 'At least one tv show is required');
