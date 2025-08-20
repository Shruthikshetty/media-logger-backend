"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesWithFilters = exports.searchMovies = exports.addBulkMovies = exports.bulkDeleteMovies = exports.updateMovieById = exports.deleteMovieById = exports.getAllMovies = exports.getMovieById = exports.addMovie = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const movie_model_1 = __importDefault(require("../models/movie.model"));
const mongo_errors_1 = require("../common/utils/mongo-errors");
const pagination_1 = require("../common/utils/pagination");
const config_constants_1 = require("../common/constants/config.constants");
// controller to add a new movie
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create a new movie
        const newMovie = new movie_model_1.default(req.validatedData);
        // save the movie
        const savedMovie = yield newMovie.save();
        if (!savedMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie creation failed' });
            return;
        }
        res.status(201).json({
            success: true,
            data: savedMovie,
            message: 'Movie created successfully',
        });
    }
    catch (err) {
        // handle unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'Movie already exists'
                : 'Server down please try again later',
        });
    }
});
exports.addMovie = addMovie;
//controller to get movie by id
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // get the movie
        const movie = yield movie_model_1.default.findById(id).lean().exec();
        // in case movie is not found
        if (!movie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie not found', statusCode: 404 });
            return;
        }
        // return the movie
        res.status(200).json({
            success: true,
            data: movie,
        });
    }
    catch (err) {
        // handle unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getMovieById = getMovieById;
/**
 * controller to fetch all the movies with pagination
 */
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get pagination params
    const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_MOVIES_LIMITS);
    try {
        //try to fetch all movies
        const [movies, total] = yield Promise.all([
            movie_model_1.default.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(start)
                .lean()
                .exec(),
            movie_model_1.default.countDocuments(),
        ]);
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // return movies
        res.status(200).json({
            success: true,
            data: {
                movies,
                pagination,
            },
        });
    }
    catch (err) {
        // handle unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getAllMovies = getAllMovies;
/**
 * delete movie by id
 */
const deleteMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // delete the movie
        const deletedMovie = yield movie_model_1.default.findByIdAndDelete(id).lean().exec();
        // in case movie is not deleted
        if (!deletedMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie does not exist', statusCode: 404 });
            return;
        }
        // return the deleted movie
        res.status(200).json({
            success: true,
            data: deletedMovie,
            message: 'Movie deleted successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.deleteMovieById = deleteMovieById;
//update  movie by id
const updateMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // update the movie
        const updatedMovie = yield movie_model_1.default.findByIdAndUpdate(id, req.validatedData, {
            new: true,
        })
            .lean()
            .exec();
        // in case movie is not updated
        if (!updatedMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie dose not exist', statusCode: 404 });
            return;
        }
        // return the updated movie
        res.status(200).json({
            success: true,
            data: updatedMovie,
            message: 'Movie updated successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.updateMovieById = updateMovieById;
//controller to bulk delete movies by taking list of ids
const bulkDeleteMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get movie ids
        const movieIds = req.validatedData.movieIds;
        //delete all the movies that are passed
        const deletedMovies = yield movie_model_1.default.deleteMany({
            _id: {
                $in: movieIds,
            },
        });
        // in case no movies are deleted
        if (deletedMovies.deletedCount === 0) {
            (0, handle_error_1.handleError)(res, { message: 'No movies found', statusCode: 404 });
            return;
        }
        // return the deleted movies
        res.status(200).json({
            success: true,
            data: {
                deletedCount: deletedMovies.deletedCount,
            },
            message: deletedMovies.deletedCount === movieIds.length
                ? 'All movies deleted successfully'
                : 'Some movies could not be deleted (IDs not found or already deleted)',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.bulkDeleteMovies = bulkDeleteMovies;
//controller to add bulk movies by json
const addBulkMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // continue inserting even if there are errors
        const savedMovies = yield movie_model_1.default.insertMany(req.validatedData, {
            ordered: false,
            throwOnValidationError: true, // throw error if validation fails
        });
        // return the added movies
        res.status(201).json({
            success: true,
            data: {
                added: savedMovies,
                notAdded: [],
            },
            message: 'Movies added successfully',
        });
    }
    catch (err) {
        // failed (duplicate) docs
        const notAdded = (err === null || err === void 0 ? void 0 : err.writeErrors)
            ? err.writeErrors.map((e) => { var _a, _b, _c, _d; return (_d = (_b = (_a = e.err) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : (_c = e.err) === null || _c === void 0 ? void 0 : _c.doc) !== null && _d !== void 0 ? _d : {}; })
            : [];
        // successfully inserted docs
        const added = (err === null || err === void 0 ? void 0 : err.insertedDocs) || [];
        // in case movies are added partially
        if (added.length > 0) {
            res.status(207).json({
                success: true,
                data: {
                    added,
                    notAdded,
                },
                message: 'Movies partially added successfully',
            });
            return;
        }
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'All movies already exist'
                : 'Server down please try again later',
            statusCode: (0, mongo_errors_1.isDuplicateKeyError)(err) ? 409 : 500,
        });
    }
});
exports.addBulkMovies = addBulkMovies;
//@TODO try out cursor based search (in this case its fine since we are dealing with small amount can be used in filters)
//search functionality
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get query from params
        const { text } = req.query;
        // get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_MOVIES_LIMITS);
        //search pipeline (atlas search)
        const pipeline = [
            {
                $search: {
                    index: config_constants_1.MOVIE_SEARCH_INDEX,
                    text: {
                        query: text,
                        path: ['title'],
                    },
                },
            },
        ];
        // search for movies
        const movies = yield movie_model_1.default.aggregate(pipeline).limit(limit).skip(start);
        // return the movies
        res.status(200).json({
            success: true,
            data: {
                movies,
                pagination: {
                    limit,
                    start,
                },
            },
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.searchMovies = searchMovies;
//get movies with filters
const getMoviesWithFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // destructure the filters from validated data
        const { languages, page, limit, status, genre, tags, averageRating, ageRating, runTime, releaseDate, } = req.validatedData;
        //define filters and pipeline
        const filters = [];
        const pipeline = [];
        //check if languages is defined
        if (languages) {
            //push language filter to filters
            filters.push({
                in: {
                    value: languages,
                    path: 'languages',
                },
            });
        }
        //check if status is defined
        if (status) {
            //push status filter to filters
            filters.push({
                in: {
                    value: status,
                    path: 'status',
                },
            });
        }
        //if genre is defined
        if (genre) {
            //push genre filter to filters
            filters.push({
                in: {
                    value: genre,
                    path: 'genre',
                },
            });
        }
        //if tags is defined
        if (tags) {
            //push tags filter to filters
            filters.push({
                in: {
                    value: tags,
                    path: 'tags',
                },
            });
        }
        if (runTime) {
            //push run time filter to filters
            filters.push({
                range: Object.assign({ path: 'runTime' }, runTime),
            });
        }
        //if average rating is present
        if (averageRating) {
            //push average rating filter to filters
            filters.push({
                range: {
                    path: 'averageRating',
                    gte: averageRating,
                },
            });
        }
        //if age rating is present
        if (ageRating) {
            //push age rating filter to filters
            filters.push({
                range: Object.assign({ path: 'ageRating' }, ageRating),
            });
        }
        //if releaseDate is present
        if (releaseDate) {
            //push release date filter to filters
            filters.push({
                range: Object.assign({ path: 'releaseDate' }, releaseDate),
            });
        }
        // build pipeline if filters are defined
        if (filters.length > 0) {
            pipeline.push({
                $search: {
                    index: config_constants_1.MOVIE_SEARCH_INDEX,
                    compound: {
                        filter: filters,
                    },
                },
            });
        }
        //Use $facet to get both paginated data and total count in one query
        const skip = (page - 1) * limit;
        pipeline.push({
            $facet: {
                data: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'total' }],
            },
        });
        //get the data from db
        const result = yield movie_model_1.default.aggregate(pipeline);
        // extract the data , total count and pagination details
        const data = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
        const pagination = (0, pagination_1.getPaginationResponse)(totalCount, limit, skip);
        // return the data
        res.status(200).json({
            success: true,
            data: {
                movies: data,
                pagination,
            },
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getMoviesWithFilters = getMoviesWithFilters;
