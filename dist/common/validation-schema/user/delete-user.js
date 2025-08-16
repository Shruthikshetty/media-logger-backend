'use strict';
/**
 * this @file contains the validation schema for delete user
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DeleteUserZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const mongodb_1 = require('mongodb');
// schema
exports.DeleteUserZodSchema = zod_1.default.object({
  id: zod_1.default.string({ required_error: 'User id is required' }).refine(
    (id) => {
      return mongodb_1.ObjectId.isValid(id);
    },
    { message: 'Invalid user id' }
  ),
});
