/**
 * This @file contains the tv episode model
 */

import { Schema, model } from 'mongoose';

//types
export interface IEpisode {
  season: string;
  title: string;
  description: string;
  episodeNumber: number;
  releaseDate: string;
  runTime: number;
}

// schema
const EpisodeSchema: Schema = new Schema(
  {
    season: {
      type: Schema.Types.ObjectId,
      ref: 'Season',
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
    episodeNumber: {
      type: Number,
      required: true,
    },
    releaseDate: {
      type: String,
      default: '',
    },
    runTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// create model from schema
const Episode = model<IEpisode>('Episode', EpisodeSchema);
export default Episode;
