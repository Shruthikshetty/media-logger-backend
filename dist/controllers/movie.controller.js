"use strict";
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
const history_utils_1 = require("../common/utils/history-utils");
// controller to add a new movie
const addMovie = async (req, res, next) => {
    try {
        // create a new movie
        const newMovie = new movie_model_1.default(req.validatedData);
        // save the movie
        const savedMovie = await newMovie.save();
        if (!savedMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie creation failed' });
            return;
        }
        res.status(201).json({
            success: true,
            data: savedMovie,
            message: 'Movie created successfully',
        });
        // set the added movie for history
        (0, history_utils_1.appendNewDoc)(res, savedMovie);
        next();
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
};
exports.addMovie = addMovie;
//controller to get movie by id
const getMovieById = async (req, res) => {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // get the movie
        const movie = await movie_model_1.default.findById(id).lean().exec();
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
};
exports.getMovieById = getMovieById;
/**
 * controller to fetch all the movies with pagination
 */
const getAllMovies = async (req, res) => {
    // get pagination params
    const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_MOVIES_LIMITS);
    try {
        //try to fetch all movies
        const [movies, total] = await Promise.all([
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
};
exports.getAllMovies = getAllMovies;
/**
 * delete movie by id
 */
const deleteMovieById = async (req, res, next) => {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // delete the movie
        const deletedMovie = await movie_model_1.default.findByIdAndDelete(id).lean().exec();
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
        // set the deleted movie for history
        (0, history_utils_1.appendOldDoc)(res, deletedMovie);
        next();
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.deleteMovieById = deleteMovieById;
//update  movie by id
const updateMovieById = async (req, res, next) => {
    try {
        // get id from params
        const { id } = req.params;
        // validate id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid movie id', statusCode: 400 });
            return;
        }
        // check if the movie exists
        const oldMovie = await movie_model_1.default.findById(id).lean().exec();
        // in case movie is not found
        if (!oldMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Movie does not exist', statusCode: 404 });
            return;
        }
        // update the movie
        const updatedMovie = await movie_model_1.default.findByIdAndUpdate(id, req.validatedData, {
            new: true,
            runValidators: true,
            context: 'query',
        })
            .lean()
            .exec();
        // in case movie is not updated
        if (!updatedMovie) {
            (0, handle_error_1.handleError)(res, { message: 'Failed to update movie', statusCode: 500 });
            return;
        }
        // return the updated movie
        res.status(200).json({
            success: true,
            data: updatedMovie,
            message: 'Movie updated successfully',
        });
        // set the updated movie for history
        (0, history_utils_1.appendOldAndNewDoc)({
            res,
            oldValue: oldMovie,
            newValue: updatedMovie,
        });
        // call next middleware
        next();
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'Movie already exists'
                : 'Server down please try again later',
        });
    }
};
exports.updateMovieById = updateMovieById;
//controller to bulk delete movies by taking list of ids
const bulkDeleteMovies = async (req, res, next) => {
    try {
        // get movie ids
        const movieIds = req.validatedData.movieIds;
        //get all existing movie  by ids
        const moviesToDelete = await movie_model_1.default.find({
            _id: { $in: movieIds },
        })
            .lean()
            .exec();
        //in case no movies are found
        if (moviesToDelete.length === 0) {
            (0, handle_error_1.handleError)(res, {
                message: 'No movies found for the provided IDs',
                statusCode: 404,
            });
            return;
        }
        //delete all the movies that are passed
        const deletedResult = await movie_model_1.default.deleteMany({
            _id: {
                $in: movieIds,
            },
        });
        // return the deleted movies
        res.status(200).json({
            success: true,
            data: {
                deletedCount: deletedResult.deletedCount,
            },
            message: `${deletedResult.deletedCount} movie(s) deleted successfully`,
        });
        // set the deleted movies for history
        (0, history_utils_1.appendOldDoc)(res, moviesToDelete);
        next();
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.bulkDeleteMovies = bulkDeleteMovies;
//controller to add bulk movies by json
const addBulkMovies = async (req, res, next) => {
    try {
        // continue inserting even if there are errors
        const savedMovies = await movie_model_1.default.insertMany(req.validatedData, {
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
        // set the added movies for history
        (0, history_utils_1.appendNewDoc)(res, savedMovies);
        next();
    }
    catch (err) {
        // failed (duplicate) docs
        const notAdded = err?.writeErrors
            ? err.writeErrors.map((e) => e.err?.op ?? e.err?.doc ?? {})
            : [];
        // successfully inserted docs
        const added = err?.insertedDocs || [];
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
            // set the added movies for history
            (0, history_utils_1.appendNewDoc)(res, added);
            next();
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
};
exports.addBulkMovies = addBulkMovies;
//@TODO try out cursor based search (in this case its fine since we are dealing with small amount can be used in filters)
//search functionality
const searchMovies = async (req, res) => {
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
        const movies = await movie_model_1.default.aggregate(pipeline).skip(start).limit(limit);
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
};
exports.searchMovies = searchMovies;
//get movies with filters
const getMoviesWithFilters = async (req, res) => {
    try {
        // destructure the filters from validated data
        const { languages, page, limit, status, genre, tags, averageRating, ageRating, runTime, releaseDate, searchText, } = req.validatedData;
        //define filters and pipeline
        const pipeline = [];
        const searchClauses = {
            must: [],
            filter: [],
        };
        //search has to be first in pipeline
        if (searchText) {
            //push search text to pipeline
            searchClauses.must.push({
                text: {
                    query: searchText,
                    path: ['title'],
                },
            });
        }
        //check if languages is defined
        if (languages) {
            //push language filter to filters
            searchClauses.filter.push({
                in: {
                    value: languages,
                    path: 'languages',
                },
            });
        }
        //check if status is defined
        if (status) {
            //push status filter to filters
            searchClauses.filter.push({
                in: {
                    value: status,
                    path: 'status',
                },
            });
        }
        //if genre is defined
        if (genre) {
            //push genre filter to filters
            searchClauses.filter.push({
                in: {
                    value: genre,
                    path: 'genre',
                },
            });
        }
        //if tags is defined
        if (tags) {
            //push tags filter to filters
            searchClauses.filter.push({
                in: {
                    value: tags,
                    path: 'tags',
                },
            });
        }
        if (runTime) {
            //push run time filter to filters
            searchClauses.filter.push({
                range: {
                    path: 'runTime',
                    ...runTime,
                },
            });
        }
        //if average rating is present
        if (averageRating) {
            //push average rating filter to filters
            searchClauses.filter.push({
                range: {
                    path: 'averageRating',
                    gte: averageRating,
                },
            });
        }
        //if age rating is present
        if (ageRating) {
            //push age rating filter to filters
            searchClauses.filter.push({
                range: {
                    path: 'ageRating',
                    ...ageRating,
                },
            });
        }
        //if releaseDate is present
        if (releaseDate) {
            //push release date filter to filters
            searchClauses.filter.push({
                range: {
                    path: 'releaseDate',
                    ...releaseDate,
                },
            });
        }
        // build pipeline if filters are defined
        // Only add a $search stage if there's something to search or filter by
        const compound = {};
        if (searchClauses.must.length)
            compound.must = searchClauses.must;
        if (searchClauses.filter.length)
            compound.filter = searchClauses.filter;
        if (Object.keys(compound).length) {
            pipeline.push({
                $search: { index: config_constants_1.MOVIE_SEARCH_INDEX, compound },
            });
        }
        // Ensure that the results are sorted by createdAt in descending order
        pipeline.push({ $sort: { createdAt: -1 } });
        //Use $facet to get both paginated data and total count in one query
        const skip = (page - 1) * limit;
        pipeline.push({
            $facet: {
                data: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'total' }],
            },
        });
        //get the data from db
        const result = await movie_model_1.default.aggregate(pipeline);
        // extract the data , total count and pagination details
        const data = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.total || 0;
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
};
exports.getMoviesWithFilters = getMoviesWithFilters;
