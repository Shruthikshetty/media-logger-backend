"use strict";
/**
 * this @file contains all the configuration constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_ALL_TV_SHOW_LIMITS = exports.GET_ALL_GAMES_LIMITS = exports.GET_ALL_MOVIES_LIMITS = exports.GET_ALL_USER_LIMITS = exports.CLOUDINARY_FOLDER = exports.ALLOWED_IMAGE_FORMATS = exports.IMAGE_FILE_SIZE = exports.TV_SHOW_SEARCH_INDEX = exports.GAME_SEARCH_INDEX = exports.MOVIE_SEARCH_INDEX = exports.JSON_FILE_SIZE = exports.ADMIN = exports.JWT_EXPIRES_IN = exports.JWT_SECRET_DEFAULT = exports.SALT_ROUNDS = void 0;
exports.SALT_ROUNDS = 10;
exports.JWT_SECRET_DEFAULT = 'super-secret';
exports.JWT_EXPIRES_IN = '1d';
exports.ADMIN = 'admin';
exports.JSON_FILE_SIZE = 1024 * 1024 * 15; // Set a 15 MB file size limit for JSON data files
exports.MOVIE_SEARCH_INDEX = 'movie_filters';
exports.GAME_SEARCH_INDEX = 'games_filter';
exports.TV_SHOW_SEARCH_INDEX = 'tv-filter';
exports.IMAGE_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
exports.ALLOWED_IMAGE_FORMATS = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];
exports.CLOUDINARY_FOLDER = 'media_logger';
exports.GET_ALL_USER_LIMITS = {
    limit: {
        min: 1,
        max: 100,
        default: 20,
    },
    start: {
        min: 0,
        default: 0,
    },
};
exports.GET_ALL_MOVIES_LIMITS = {
    limit: {
        min: 1,
        max: 50,
        default: 20,
    },
    start: {
        min: 0,
        default: 0,
    },
};
exports.GET_ALL_GAMES_LIMITS = {
    limit: {
        min: 1,
        max: 50,
        default: 20,
    },
    start: {
        min: 0,
        default: 0,
    },
};
exports.GET_ALL_TV_SHOW_LIMITS = {
    limit: {
        min: 1,
        max: 50,
        default: 20,
    },
    start: {
        min: 0,
        default: 0,
    },
};
