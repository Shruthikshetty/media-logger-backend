"use strict";
/**
 * @file contains the zod validation schema for bulk addition of games
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAddGameZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const add_game_1 = require("./add-game");
//schema
exports.BulkAddGameZodSchema = zod_1.default
    .array(add_game_1.AddGameZodSchema, {
    message: 'Games must be an array of game objects',
})
    .min(1, 'At least one game is required');
