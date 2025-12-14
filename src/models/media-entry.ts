/**
 * @file contains the model for media entry
 * this model stores user media entry , status , rating etc
 * dynamically for all media types
 */

import { model, Schema, Document } from 'mongoose';
import {
  MEDIA_ENTRY_MODELS,
  MEDIA_ENTRY_STATUS,
} from '../common/constants/model.constants';

//types
export interface IMediaEntry extends Document {
  user: Schema.Types.ObjectId;
  mediaItem: Schema.Types.ObjectId;
  onModel: string;
  status: string;
  rating?: number;
}

//schema
const MediaEntrySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaItem: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: MEDIA_ENTRY_MODELS,
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
  },
  {
    timestamps: true,
  }
);

// create unique index for user, mediaItem, onModel
MediaEntrySchema.index({ user: 1, mediaItem: 1, onModel: 1 }, { unique: true });

//create model
const MediaEntry = model<IMediaEntry>('MediaEntry', MediaEntrySchema);
export default MediaEntry;
