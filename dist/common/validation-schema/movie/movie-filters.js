'use strict';
/**
 * This file contains the validation schema for movie filters
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.MovieFiltersZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const config_constants_1 = require('../../constants/config.constants');
const lodash_1 = require('lodash');
exports.MovieFiltersZodSchema = zod_1.default
  .object({
    averageRating: zod_1.default
      .number({
        message: 'Average rating must be number',
      })
      .optional(),
    genre: zod_1.default
      .array(zod_1.default.string({ message: 'Genre must be string' }), {
        message: 'Genre must be an array of strings',
      })
      .optional(),
    releaseDate: zod_1.default
      .object({
        lte: zod_1.default
          .string({
            message: 'Release date lte must be string',
          })
          .datetime({
            message:
              'Release date lte must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          })
          .transform((val) => new Date(val))
          .optional(),
        gte: zod_1.default
          .string({
            message: 'Release date gte must be string',
          })
          .datetime({
            message:
              'Release date gte must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          })
          .transform((val) => new Date(val))
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Release date must include at least one of gte or lte',
      })
      .optional(),
    runTime: zod_1.default
      .object({
        gte: zod_1.default
          .number({
            message: 'Run time gte must be number',
          })
          .min(0)
          .optional(),
        lte: zod_1.default
          .number({
            message: 'Run time lte must be number',
          })
          .min(0)
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Run time must include at least one of gte or lte',
      })
      .optional(),
    languages: zod_1.default
      .array(
        zod_1.default
          .string({
            message: 'Languages must be string',
          })
          .transform((val) => val.toLowerCase())
      )
      .refine((data) => data.length > 0, {
        message:
          'Languages must be an array of strings with at least one value',
      })
      .optional(),
    tags: zod_1.default
      .array(zod_1.default.string({ message: 'Tags must be string' }), {
        message: 'Tags must be an array of strings',
      })
      .optional(),
    status: zod_1.default
      .string({
        required_error: 'Status is required',
        message: 'Status must be string',
      })
      .optional(),
    ageRating: zod_1.default
      .object({
        gte: zod_1.default
          .number({
            message: 'Age rating gte must be number',
          })
          .min(0)
          .optional(),
        lte: zod_1.default
          .number({
            message: 'Age rating lte must be number',
          })
          .min(0)
          .optional(),
      })
      .refine((data) => data.gte !== undefined || data.lte !== undefined, {
        message: 'Age rating must include at least one of gte or lte',
      })
      .optional(),
    limit: zod_1.default
      .number({
        message: 'Limit must be number',
      })
      .max(config_constants_1.GET_ALL_MOVIES_LIMITS.limit.max)
      .min(config_constants_1.GET_ALL_MOVIES_LIMITS.limit.min)
      .default(config_constants_1.GET_ALL_MOVIES_LIMITS.limit.default),
    page: zod_1.default
      .number({
        message: 'Page must be number',
      })
      .min(1)
      .default(1),
  })
  .superRefine((data, ctx) => {
    const hasValue = Object.values(
      (0, lodash_1.omit)(data, 'limit', 'start', 'page')
    ).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: zod_1.default.ZodIssueCode.custom,
        message: 'Provide filter for results to appear',
        path: [],
      });
    }
  });
