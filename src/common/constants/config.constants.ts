/**
 * this @file contains all the configuration constants
 */

export const SALT_ROUNDS = 10;

export const JWT_SECRET_DEFAULT = 'super-secret';

export const JWT_EXPIRES_IN = '1d';

export const ADMIN = 'admin';

export const JSON_FILE_SIZE = 1024 * 1024 * 15; // Set a 15 MB file size limit for JSON data files

export const MOVIE_SEARCH_INDEX = 'movie_filters';

export const GAME_SEARCH_INDEX = 'games_filter';

export const TV_SHOW_SEARCH_INDEX = 'tv-filter';

export const IMAGE_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const ALLOWED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const CLOUDINARY_FOLDER = 'media_logger';

export const GET_ALL_USER_LIMITS = {
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

export const GET_ALL_MOVIES_LIMITS = {
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

export const GET_ALL_GAMES_LIMITS = {
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

export const GET_ALL_TV_SHOW_LIMITS = {
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

export const GET_ALL_HISTORY_LIMITS = {
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

export const GET_ALL_MEDIA_COMMENTS_LIMITS = {
  limit: {
    min: 1,
    max: 200,
    default: 20,
  },
};

export const HISTORY_RETENTION_DAYS = 180;

//sanitization custom rules
export const CUSTOM_SANITIZATION_RULES = ['password', 'token'];

export const RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT = 2000; // ms (2s)

export const RECOMMENDER_MS_REQUEST_TIMEOUT = 5000; // ms (5s)
