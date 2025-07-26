/**
 * This @file contains the movie model
 */

import { Schema, Document, model } from 'mongoose';
import {
  MEDIA_STATUS,
  GENRE_MOVIE_TV,
  TAGS,
} from '../common/constants/model.constants';

//types
export interface IMovie extends Document {
  title: string;
  description: string;
  averageRating: number;
  genre: string[];
  releaseDate: string;
  cast: string[];
  directors: string[];
  runTime: number; // in minutes
  languages: string[];
  posterUrl: string;
  backdropUrl: string;
  isActive: boolean;
  status: string;
  tags: string[];
  ageRating: number;
  trailerYoutubeUrl: string;
}

// schema
const MovieSchema: Schema = new Schema(
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
      type: Date, // will be iso string
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
      default: true,
    },
    status: {
      type: String,
      required: false,
      default: MEDIA_STATUS[0],
      enum: MEDIA_STATUS,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
      enum: TAGS,
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

// create model from the above model
const Movie = model<IMovie>('Movie', MovieSchema);
export default Movie;
