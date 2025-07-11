/**
 * This contains the movie model
 */

import { Schema, Document, model } from 'mongoose';
import { MEDIA_STATUS, GENRE, TAGS } from '../common/constants/model.constants';

//types
export interface IMovie extends Document {
  title: string;
  description: string;
  averageRating: number;
  genre: string[];
  releaseDate: Date;
  cast: string[];
  directors: string[];
  runTime: number; // in min
  languages: string[];
  posterUrl: string;
  backdropUrl: string;
  isActive: boolean;
  status: string;
  tags: string[];
}

// schema
const MovieSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
    required: false,
    default: 0,
  },
  genre: {
    type: [String],
    required: true,
    enum: GENRE,
  },
  releaseDate: {
    type: Date,
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
    required: true,
  },
  backdropUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    required: false,
    default: 'active',
    enum: MEDIA_STATUS,
  },
  tags: {
    type: [String],
    required: false,
    default: [],
    enum: TAGS,
  },
});

// create model from the above model
export default model<IMovie>('Movie', MovieSchema);
