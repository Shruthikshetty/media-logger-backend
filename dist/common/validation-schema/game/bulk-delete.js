'use strict';
/**
 * @file contains the zod validation schema for bulk delete games
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BulkDeleteGameZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const mongo_errors_1 = require('../../utils/mongo-errors');
//schema
exports.BulkDeleteGameZodSchema = zod_1.default.object({
  gameIds: zod_1.default
    .array(
      zod_1.default
        .string({
          required_error: 'Game ids are required',
          message: 'Game ids must be string',
        })
        .refine((value) => (0, mongo_errors_1.isMongoIdValid)(value), {
          message: 'Invalid game id',
        })
    )
    .min(1, 'At least one game id is required'),
});
