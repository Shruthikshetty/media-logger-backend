"use strict";
/**
 * @file contains the model for media entry
 * this model stores user media entry , status , rating etc
 * dynamically for all media types
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
//schema
const MediaEntrySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mediaItem: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: model_constants_1.MEDIA_ENTRY_MODELS,
    },
    status: {
        type: String,
        required: true,
        enum: model_constants_1.MEDIA_ENTRY_STATUS,
    },
    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
    },
}, {
    timestamps: true,
});
// create unique index for user, mediaItem, onModel
MediaEntrySchema.index({ user: 1, mediaItem: 1, onModel: 1 }, { unique: true });
//create model
const MediaEntry = (0, mongoose_1.model)('MediaEntry', MediaEntrySchema);
exports.default = MediaEntry;
