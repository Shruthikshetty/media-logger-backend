'use strict';
/**
 * This @file contains the game model
 */
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
const model_constants_1 = require('../common/constants/model.constants');
//schema
const GameSchema = new mongoose_1.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      required: false,
    },
    genre: {
      type: [String],
      required: true,
      enum: model_constants_1.GAME_GENRES,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: false,
      default: '',
    },
    backdropUrl: {
      type: String,
      required: false,
      default: '',
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    status: {
      type: String,
      required: true,
      enum: model_constants_1.MEDIA_STATUS,
    },
    platforms: {
      type: [String],
      required: true,
      enum: model_constants_1.GAME_PLATFORMS,
    },
    avgPlaytime: {
      type: Number,
      required: false,
    },
    developer: {
      type: String,
      required: false,
      default: '',
    },
    ageRating: {
      type: Number,
      required: false,
    },
    trailerYoutubeUrl: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);
const Game = (0, mongoose_1.model)('Game', GameSchema);
exports.default = Game;
