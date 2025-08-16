'use strict';
/**
 * @file contains the zod validation schema from user login
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.LoginZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const patterns_constants_1 = require('../../constants/patterns.constants');
exports.LoginZodSchema = zod_1.default.object({
  email: zod_1.default
    .string({
      required_error: 'Email is required',
      message: 'Email must be string',
    })
    .regex(patterns_constants_1.Regex.email, 'Email is not valid'),
  password: zod_1.default.string({
    required_error: 'Password is required',
    message: 'Password must be string',
  }),
});
