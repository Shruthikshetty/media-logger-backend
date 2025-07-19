/**
 * This contains the tv show model
 */

import { Schema, Document, model } from 'mongoose';
import {
  GENRE_MOVIE_TV,
  MEDIA_STATUS,
  TAGS,
} from '../common/constants/model.constants';

//types
export interface ITVShow extends Document {
  title: string;
  description: string;
  averageRating: number;
  genre: string[];
  releaseDate: string;
  cast: string[];
  directors: string[];
  runTime: number;
  languages: string[];
  posterUrl: string;
  backdropUrl: string;
  isActive: boolean;
  status: string;
  tags: string[];
  totalSeasons: number;
  totalEpisodes: number;
  ageRating: number;
}

//schema
const TVShowSchema: Schema = new Schema(
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
      max: 10,
    },
    genre: {
      type: [String],
      required: true,
      enum: GENRE_MOVIE_TV,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    cast: {
      type: [String],
      required: false,
      default: [],
    },
    directors: {
      type: [String],
      required: false,
      default: [],
    },
    runTime: {
      type: Number,
      required: true,
    },
    languages: {
      type: [String],
      required: false,
      default: [],
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
      default: true,
    },
    status: {
      type: String,
      required: true,
      enum: MEDIA_STATUS,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
      enum: TAGS,
    },
    totalSeasons: {
      type: Number,
      required: true,
    },
    totalEpisodes: {
      type: Number,
      required: true,
    },
    ageRating: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

// create model from the above schema
const TVShow = model<ITVShow>('TVShow', TVShowSchema);
export default TVShow;
