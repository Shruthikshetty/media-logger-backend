"use strict";
/**
 * This @file contains the movie model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const model_constants_1 = require("../common/constants/model.constants");
// schema
const MovieSchema = new mongoose_1.Schema({
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
        max: 10,
    },
    genre: {
        type: [String],
        required: true,
        enum: model_constants_1.GENRE_MOVIE_TV,
    },
    releaseDate: {
        type: Date, // will be iso string
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
    runTime: {
        type: Number,
        required: true,
    },
    languages: {
        type: [String],
        required: true,
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
        required: false,
        default: model_constants_1.MEDIA_STATUS[0],
        enum: model_constants_1.MEDIA_STATUS,
    },
    tags: {
        type: [String],
        required: false,
        default: [],
        enum: model_constants_1.TAGS,
    },
    ageRating: {
        type: Number,
        required: false,
    },
    trailerYoutubeUrl: {
        type: String,
        required: false,
        default: '',
    },
}, { timestamps: true });
// create model from the above model
const Movie = (0, mongoose_1.model)('Movie', MovieSchema);
exports.default = Movie;
