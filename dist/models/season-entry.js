"use strict";
/**
 * @file contains the model for season entry
 * this contains season status , with each episode completed status
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonEntrySchema = void 0;
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
//schema
exports.SeasonEntrySchema = new mongoose_1.Schema({
    season: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Season',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    episodes: [
        {
            episode: {
                type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
//create model
const SeasonEntry = (0, mongoose_1.model)('SeasonEntry', exports.SeasonEntrySchema);
exports.default = SeasonEntry;
