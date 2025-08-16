'use strict';
/**
 * @file This file contains the validation schema for updating a TV show
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateTvShowZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const add_tv_show_1 = require('./add-tv-show');
//schema
exports.UpdateTvShowZodSchema = add_tv_show_1.AddTvShowZodSchema.omit({
  seasons: true,
})
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
