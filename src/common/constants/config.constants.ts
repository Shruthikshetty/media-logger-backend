/**
 * this @file contains all the configuration constants
 */

export const SALT_ROUNDS = 10;

export const JWT_SECRET_DEFAULT = 'super-secret';

export const JWT_EXPIRES_IN = '1d';

export const ADMIN = 'admin';

export const JSON_FILE_SIZE = 1024 * 1024 * 15; // Set a 15 MB file size limit for JSON data files

export const MOVIE_SEARCH_INDEX = "movie_filters"

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
