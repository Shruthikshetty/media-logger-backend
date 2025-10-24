/**
 * This @file contains the model for history
 * containing all the history of media addition , update and deletion
 */

import { model, Schema } from 'mongoose';
import {
  HISTORY_ACTION,
  HISTORY_ENTITY,
} from '../common/constants/model.constants';
import { HISTORY_RETENTION_DAYS } from '../common/constants/config.constants';

//types
export type IHistory = {
  user: string;
  entityType: string;
  entityId?: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  title: string;
};

//schema
const HistorySchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: HISTORY_ENTITY,
    },
    entityId: {
      type: String,
      required: false,
    },
    action: {
      type: String,
      required: true,
      enum: HISTORY_ACTION,
    },
    oldValue: {
      type: Schema.Types.Mixed,
      required: false,
    },
    newValue: {
      type: Schema.Types.Mixed,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add the TTL index on the createdAt field
HistorySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: HISTORY_RETENTION_DAYS * 60 * 60 }
);

// create model from the above schema
const History = model<IHistory>('History', HistorySchema);
export default History;
