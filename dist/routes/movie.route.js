"use strict";
/**
 * @file contains the movie related routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_movie_1 = require("../common/validation-schema/movie/add-movie");
const update_movie_1 = require("../common/validation-schema/movie/update-movie");
const bulk_delete_1 = require("../common/validation-schema/movie/bulk-delete");
const json_upload_config_1 = __importDefault(require("../common/config/json-upload.config"));
const handle_json_file_validation_1 = require("../common/middleware/handle-json-file-validation");
const bulk_add_1 = require("../common/validation-schema/movie/bulk-add");
const handle_upload_1 = require("../common/middleware/handle-upload");
const movie_filters_1 = require("../common/validation-schema/movie/movie-filters");
// initialize router
const route = (0, express_1.Router)();
// get all movies
route.get('/', movie_controller_1.getAllMovies);
//search a movie by title
route.get('/search', movie_controller_1.searchMovies);
//get movies with filters
route.get('/filter', (0, handle_validation_1.validateReq)(movie_filters_1.MovieFiltersZodSchema), movie_controller_1.getMoviesWithFilters);
//get movie by id
route.get('/:id', movie_controller_1.getMovieById);
// add a movie
route.post('/', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(add_movie_1.AddMovieZodSchema), movie_controller_1.addMovie);
// add bulk movies in json file
route.post('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_upload_1.handleUpload)(json_upload_config_1.default, 'movieDataFile'), (0, handle_json_file_validation_1.ValidateJsonFile)(bulk_add_1.BulkAddMovieZodSchema), movie_controller_1.addBulkMovies);
//Route to bulk delete movies
route.delete('/bulk', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(bulk_delete_1.BulkDeleteMovieZodSchema), movie_controller_1.bulkDeleteMovies);
// delete movie by id
route.delete('/:id', (0, require_auth_1.requireAuth)('admin'), movie_controller_1.deleteMovieById);
// update a movie by id
route.patch('/:id', (0, require_auth_1.requireAuth)('admin'), (0, handle_validation_1.validateReq)(update_movie_1.updateMoveZodSchema), movie_controller_1.updateMovieById);
// export all the routes
exports.default = route;
