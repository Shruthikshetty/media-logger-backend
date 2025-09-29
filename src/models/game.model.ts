/**
 * This @file contains the game model
 */

import { Schema, Document, model } from 'mongoose';
import {
  GAME_GENRES,
  GAME_PLATFORMS,
  MEDIA_STATUS,
} from '../common/constants/model.constants';

//types
export interface IGame extends Document {
  title: string;
  description: string;
  averageRating: number;
  genre: string[];
  releaseDate: Date;
  posterUrl: string;
  backdropUrl: string;
  isActive: boolean;
  status: string;
  platforms: string[];
  avgPlaytime?: number;
  developer: string;
  ageRating: number;
  youtubeVideoId?: string;
}

//schema
const GameSchema: Schema = new Schema(
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
      enum: GAME_GENRES,
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
      enum: MEDIA_STATUS,
    },
    platforms: {
      type: [String],
      required: true,
      enum: GAME_PLATFORMS,
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
    youtubeVideoId: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);

const Game = model<IGame>('Game', GameSchema);

export default Game;
