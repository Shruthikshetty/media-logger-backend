/**
 * this @file contains all the configuration constants
 */

export const SALT_ROUNDS = 10;

export const JWT_SECRET_DEFAULT = 'super-secret';

export const JWT_EXPIRES_IN = '1d';

export const ADMIN = 'admin';

export const GET_ALL_USER_LIMITS = {
  limits: {
    min: 1,
    max: 100,
    default: 20,
  },
  start: {
    min: 0,
    default: 0,
  },
};
