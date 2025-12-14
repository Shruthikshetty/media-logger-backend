/**
 * @file contains the model for season entry
 * this contains season status , with each episode completed status
 */

import { model, Schema } from 'mongoose';
import { MEDIA_ENTRY_STATUS } from '../common/constants/model.constants';

//type
interface ISeasonEntry extends Document {
  season: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: string;
  rating?: number;
  episodes: {
    episode: Schema.Types.ObjectId;
    watched: boolean;
    rating?: number;
    date?: Date;
  }[];
}

//schema
export const SeasonEntrySchema = new Schema(
  {
    season: {
      type: Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: MEDIA_ENTRY_STATUS,
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 10,
    },
    episodes: [
      {
        episode: {
          type: Schema.Types.ObjectId,
          ref: 'Episode',
          required: true,
        },
        watched: {
          type: Boolean,
          required: true,
          default: false,
        },
        rating: {
          type: Number,
          required: false,
          min: 0,
          max: 10,
        },
        date: {
          type: Date,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//create model
const SeasonEntry = model<ISeasonEntry>('SeasonEntry', SeasonEntrySchema);
export default SeasonEntry;
