'use strict';
/**
 * @file holds the add bulk movie validation schema
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.BulkAddMovieZodSchema = void 0;
const add_movie_1 = require('./add-movie');
//schema
exports.BulkAddMovieZodSchema = add_movie_1.AddMovieZodSchema.array().min(
  1,
  'At least one movie is required'
);
