/**
 * This contains the tv show seasons model model
 */

import { Schema, model, Document } from 'mongoose';
import { SEASON_STATUS } from '../common/constants/model.constants';

//types...
interface ISeason extends Document {
  tvShow: string;
  seasonNumber: number;
  description: string;
  releaseDate: string;
  noOfEpisodes: number;
  posterUrl: string;
  seasonRating?: number;
  status: string;
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
    description: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: String,
      required: true,
    },
    noOfEpisodes: {
      type: Number,
      required: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
    seasonRating: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: SEASON_STATUS,
    },
  },
  { timestamps: true }
);

// create the model from above schema
const Season = model<ISeason>('Season', SeasonSchema);
export default Season;
