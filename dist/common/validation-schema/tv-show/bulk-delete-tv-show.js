'use strict';
/**
 * this @file contains the validation schema for bulk delete tv shows
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BulkDeleteTvShowZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const mongo_errors_1 = require('../../utils/mongo-errors');
//schema
exports.BulkDeleteTvShowZodSchema = zod_1.default.object({
  tvShowIds: zod_1.default
    .array(
      zod_1.default
        .string({ message: 'Tv show id must be string' })
        .refine((val) => (0, mongo_errors_1.isMongoIdValid)(val), {
          message: 'Invalid tv show id',
        })
    )
    .min(1, 'At least one tv show id is required'),
});
