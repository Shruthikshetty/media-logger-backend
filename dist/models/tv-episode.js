"use strict";
/**
 * This @file contains the tv episode model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// schema
const EpisodeSchema = new mongoose_1.Schema({
    season: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: Date,
    },
    runTime: {
        type: Number,
        required: false,
    },
    stillUrl: {
        type: String,
        required: false,
    },
    averageRating: {
        type: Number,
        required: false,
        max: 10,
        min: 0,
    },
}, { timestamps: true });
// create model from schema
const Episode = (0, mongoose_1.model)('Episode', EpisodeSchema);
exports.default = Episode;
