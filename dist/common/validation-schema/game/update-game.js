'use strict';
/**
 * @file contains zod schema for updating game
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateGameZodSchema = void 0;
const zod_1 = __importDefault(require('zod'));
const add_game_1 = require('./add-game');
//schema
exports.UpdateGameZodSchema = add_game_1.AddGameZodSchema.partial().superRefine(
  (data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
      ctx.addIssue({
        code: zod_1.default.ZodIssueCode.custom,
        message: 'At least one field must be updated',
        path: [],
      });
    }
  }
);
