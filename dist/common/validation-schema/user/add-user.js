'use strict';
/**
 * @file holds the add user validation schema and type
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AddUserZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const patterns_constants_1 = require('../../constants/patterns.constants');
//schema const for add user
exports.AddUserZodSchema = zod_1.default.object({
  name: zod_1.default
    .string({
      required_error: 'Name is required',
      message: 'Name must be string',
    })
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  password: zod_1.default.string({
    required_error: 'Password is required',
    message: 'Password must be string',
  }),
  email: zod_1.default
    .string({ required_error: 'Email is required' })
    .regex(patterns_constants_1.Regex.email, 'Email is not valid'),
  bio: zod_1.default
    .string({ message: 'Bio must be string' })
    .max(200, 'Bio can be at most 200 characters')
    .optional()
    .default(''),
  location: zod_1.default
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(50, 'Location must be at most 50 characters')
    .optional(),
  profileImg: zod_1.default.string().optional().default(''),
  xp: zod_1.default.number().optional().default(0),
});
