"use strict";
/**
 * This @file contains the model for history
 * containing all the history of media addition , update and deletion
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
const config_constants_1 = require("../common/constants/config.constants");
//schema
const HistorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: model_constants_1.HISTORY_ENTITY,
    },
    entityId: {
        type: String,
        required: false,
    },
    action: {
        type: String,
        required: true,
        enum: model_constants_1.HISTORY_ACTION,
    },
    oldValue: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    newValue: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    bulk: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
// Add the TTL index on the createdAt field
HistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: config_constants_1.HISTORY_RETENTION_DAYS * 24 * 60 * 60 });
// create model from the above schema
const History = (0, mongoose_1.model)('History', HistorySchema);
exports.default = History;
