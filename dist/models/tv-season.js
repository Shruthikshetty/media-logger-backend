"use strict";
/**
 * This contains the tv show seasons model model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
// schema
const SeasonSchema = new mongoose_1.Schema({
    tvShow: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: model_constants_1.SEASON_STATUS,
    },
    trailerYoutubeUrl: {
        type: String,
        required: false,
        default: '',
    },
}, { timestamps: true });
// create the model from above schema
const Season = (0, mongoose_1.model)('Season', SeasonSchema);
exports.default = Season;
