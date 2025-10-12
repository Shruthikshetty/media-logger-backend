/**
 * This contains the tv show seasons model model
 */

import { Schema, model, Document } from 'mongoose';
import { SEASON_STATUS } from '../common/constants/model.constants';

//types...
export interface ISeason extends Document {
  tvShow: string;
  seasonNumber: number;
  description: string;
  releaseDate?: Date;
  noOfEpisodes: number;
  posterUrl: string;
  status: string;
  youtubeVideoId?: string;
  averageRating?: number;
}

// schema
const SeasonSchema: Schema = new Schema(
  {
    tvShow: {
      type: Schema.Types.ObjectId,
      ref: 'TVShow',
      required: true,
    },
    seasonNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: Date,
      required: false,
    },
    noOfEpisodes: {
      type: Number,
      required: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: SEASON_STATUS,
    },
    youtubeVideoId: {
      type: String,
      required: false,
    },
    averageRating: {
      type: Number,
      required: false,
      max: 10,
      min: 0,
    },
  },
  { timestamps: true }
);

// create the model from above schema
const Season = model<ISeason>('Season', SeasonSchema);
export default Season;
