"use strict";
/**
 * This contains the tv show model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
//schema
const TVShowSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        required: false,
        min: 0,
        max: 10,
    },
    genre: {
        type: [String],
        required: true,
        enum: model_constants_1.GENRE_MOVIE_TV,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    cast: {
        type: [String],
        required: false,
        default: [],
    },
    directors: {
        type: [String],
        required: false,
        default: [],
    },
    avgRunTime: {
        type: Number,
        required: false,
    },
    languages: {
        type: [String],
        required: false,
        default: [],
    },
    posterUrl: {
        type: String,
        required: false,
        default: '',
    },
    backdropUrl: {
        type: String,
        required: false,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        required: true,
        enum: model_constants_1.MEDIA_STATUS,
    },
    tags: {
        type: [String],
        required: false,
        default: [],
        enum: model_constants_1.TAGS,
    },
    totalSeasons: {
        type: Number,
        required: true,
    },
    totalEpisodes: {
        type: Number,
        required: true,
    },
    ageRating: {
        type: Number,
        required: false,
    },
    youtubeVideoId: {
        type: String,
        required: false,
        default: '',
    },
    tmdbId: {
        type: String,
        required: false,
    },
    imdbId: {
        type: String,
        required: false,
    },
}, { timestamps: true });
// create model from the above schema
const TVShow = (0, mongoose_1.model)('TVShow', TVShowSchema);
exports.default = TVShow;
