"use strict";
/**
 * This @file contains the controller related to tv-show
 */
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
exports.bulkAddTvShow = exports.filterTvShow = exports.searchTvShow = exports.bulkDeleteTvShow = exports.deleteTvShowById = exports.updateTvShowById = exports.getTvShowById = exports.getAllTvShows = exports.addTvShow = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const tv_show_mode_1 = __importDefault(require("../models/tv-show.mode"));
const mongoose_1 = require("mongoose");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const pagination_1 = require("../common/utils/pagination");
const config_constants_1 = require("../common/constants/config.constants");
const get_tv_show_1 = require("../common/utils/get-tv-show");
const delete_tv_show_1 = require("../common/utils/delete-tv-show");
const add_tv_show_1 = require("../common/utils/add-tv-show");
const history_utils_1 = require("../common/utils/history-utils");
// controller to add a new tv show
const addTvShow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Start a Mongoose session for the transaction
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        // save the tv show
        const savedTvShow = yield (0, add_tv_show_1.addSingleTvShow)(req.validatedData, session);
        // If all operations were successful, commit the transaction
        yield session.commitTransaction();
        // return the saved tv show
        res.status(200).json({
            success: true,
            data: savedTvShow,
            message: 'Tv show created successfully',
        });
        // record the added tv show in history
        (0, history_utils_1.appendNewDoc)(res, savedTvShow);
        next();
    }
    catch (error) {
        // If any error occurred, abort the entire transaction
        yield session.abortTransaction();
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: error,
            message: (error === null || error === void 0 ? void 0 : error.message) || (0, mongo_errors_1.isDuplicateKeyError)(error)
                ? 'Tv show already exists'
                : 'Server down please try again later',
        });
    }
    finally {
        // Finally, end the session
        session.endSession();
    }
});
exports.addTvShow = addTvShow;
// get all the tv show
const getAllTvShows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get pagination params
    const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_TV_SHOW_LIMITS);
    try {
        //get all the tv shows
        const [tvShows, total] = yield (0, get_tv_show_1.getTvShowDetails)(req.query.fullDetails, start, limit);
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // return the tv shows
        res.status(200).json({
            success: true,
            data: {
                tvShows,
                pagination,
            },
        });
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, { error: error });
    }
});
exports.getAllTvShows = getAllTvShows;
//get tv show by id
const getTvShowById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid tv show id', statusCode: 400 });
            return;
        }
        // get the tv show details
        const tvShow = yield tv_show_mode_1.default.findById(id).lean().exec();
        // in case tv show is not found
        if (!tvShow) {
            (0, handle_error_1.handleError)(res, { message: 'Tv show not found', statusCode: 404 });
            return;
        }
        // add episodes to each season
        const seasonsWithEpisodes = yield (0, get_tv_show_1.getSeasonsWithEpisodes)(tvShow._id);
        // return the tv show with seasons and episodes
        res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, tvShow), { seasons: seasonsWithEpisodes }),
        });
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, { error: error });
    }
});
exports.getTvShowById = getTvShowById;
// controller to update tv show by id
const updateTvShowById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //extract id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid tv show id', statusCode: 400 });
            return;
        }
        //get the old tv show record
        const oldTvShow = yield tv_show_mode_1.default.findById(id).lean().exec();
        if (!oldTvShow) {
            (0, handle_error_1.handleError)(res, { message: 'Tv show not found', statusCode: 404 });
            return;
        }
        //update the tv show by id
        const updatedTvShow = yield tv_show_mode_1.default.findByIdAndUpdate(id, req.validatedData, { new: true })
            .lean()
            .exec();
        // return the updated tv show
        res.status(200).json({
            success: true,
            data: {
                tvShow: updatedTvShow,
            },
            message: 'Tv show updated successfully',
        });
        // record the updated tv show in history
        (0, history_utils_1.appendOldAndNewDoc)({ res, newValue: updatedTvShow, oldValue: oldTvShow });
        next();
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, { error: error });
    }
});
exports.updateTvShowById = updateTvShowById;
// controller to delete tv show by id
const deleteTvShowById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //initialize transaction session
    const session = yield (0, mongoose_1.startSession)();
    //start transaction
    session.startTransaction();
    try {
        // destructure id
        const { id } = req.params;
        //check if the id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid tv show id', statusCode: 400 });
            return;
        }
        // find the tv show by id
        const tvShow = yield tv_show_mode_1.default.findById(id).lean().exec();
        //in case tv show is not found
        if (!tvShow) {
            (0, handle_error_1.handleError)(res, {
                message: `TV show with id ${id} not found`,
                statusCode: 404,
            });
            return;
        }
        // delete tv show
        const { deletedCount } = yield (0, delete_tv_show_1.deleteTvShow)(id, session);
        //commit the transaction
        yield session.commitTransaction();
        // return the deleted tv show count
        res.status(200).json({
            success: true,
            data: {
                deletedCount,
            },
            message: 'Tv show deleted successfully',
        });
        // record the deleted tv show in history
        (0, history_utils_1.appendOldDoc)(res, tvShow);
        next();
    }
    catch (err) {
        session.abortTransaction();
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            statusCode: err === null || err === void 0 ? void 0 : err.statusCode,
            message: err === null || err === void 0 ? void 0 : err.message,
        });
    }
    finally {
        session.endSession();
    }
});
exports.deleteTvShowById = deleteTvShowById;
//controller to bulk delete tv show
const bulkDeleteTvShow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // create a mongo transaction session
    const session = yield (0, mongoose_1.startSession)();
    //start transaction
    session.startTransaction();
    try {
        // get the ids from validated data
        const { tvShowIds } = req.validatedData;
        //get all the tv shows
        const tvShows = yield tv_show_mode_1.default.find({ _id: { $in: tvShowIds } })
            .lean()
            .exec();
        //in case no tv shows are found
        if (tvShows.length === 0) {
            (0, handle_error_1.handleError)(res, { message: 'No tv shows found', statusCode: 404 });
            return;
        }
        const deleteCount = {
            tvShow: 0,
            seasons: 0,
            episodes: 0,
        };
        for (const id of tvShowIds) {
            // delete tv show
            const { deletedCount: receivedDeletedCount } = yield (0, delete_tv_show_1.deleteTvShow)(id, session);
            //update count
            deleteCount.tvShow += receivedDeletedCount.tvShow;
            deleteCount.seasons += receivedDeletedCount.seasons;
            deleteCount.episodes += receivedDeletedCount.episodes;
        }
        //commit the transaction
        yield session.commitTransaction();
        // return the deleted tv show count
        res.status(200).json({
            success: true,
            data: {
                deleteCount,
            },
            message: "Tv show's deleted successfully",
        });
        //record the deleted tv show in history
        (0, history_utils_1.appendOldDoc)(res, tvShows);
        next();
    }
    catch (err) {
        session.abortTransaction();
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            statusCode: err === null || err === void 0 ? void 0 : err.statusCode,
            message: err === null || err === void 0 ? void 0 : err.message,
        });
    }
    finally {
        //end session
        yield session.endSession();
    }
});
exports.bulkDeleteTvShow = bulkDeleteTvShow;
//controller for search tv show
const searchTvShow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get the search text from query params
        const { text } = req.query;
        //get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_TV_SHOW_LIMITS);
        //search pipe line
        const pipeline = [
            {
                $search: {
                    index: config_constants_1.TV_SHOW_SEARCH_INDEX,
                    text: {
                        query: text,
                        path: ['title'],
                    },
                },
            },
            {
                $facet: {
                    //  Get the paginated data
                    paginatedResults: [{ $skip: start }, { $limit: limit }],
                    //  Get the total count of matched documents
                    totalCount: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
        ];
        //get the tv shows
        const results = yield tv_show_mode_1.default.aggregate(pipeline);
        //get the tv shows
        const resultDoc = results[0];
        const tvShows = resultDoc.paginatedResults;
        const total = resultDoc.totalCount.length > 0 ? resultDoc.totalCount[0].count : 0;
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        //send response
        res.status(200).json({
            success: true,
            data: {
                tvShows,
                pagination,
            },
        });
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, { error: error });
    }
});
exports.searchTvShow = searchTvShow;
//controller for filter tv show
const filterTvShow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        //destructure validated data
        const { genre, limit, page, languages, status, averageRating, releaseDate, avgRunTime, tags, totalEpisodes, totalSeasons, searchText, } = req.validatedData;
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
        //check if genre is defined
        if (genre) {
            searchClauses.filter.push({
                in: {
                    path: 'genre',
                    value: genre,
                },
            });
        }
        //check if tags is defined
        if (tags) {
            searchClauses.filter.push({
                in: {
                    path: 'tags',
                    value: tags,
                },
            });
        }
        //check if status is defined
        if (status) {
            searchClauses.filter.push({
                in: {
                    path: 'status',
                    value: status,
                },
            });
        }
        //check if averageRating is defined
        if (averageRating) {
            searchClauses.filter.push({
                range: {
                    path: 'averageRating',
                    gte: averageRating,
                },
            });
        }
        //check if releaseDate is defined
        if (releaseDate) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'releaseDate' }, releaseDate),
            });
        }
        //check if runTime is defined
        if (avgRunTime) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'avgRunTime' }, avgRunTime),
            });
        }
        //check if totalEpisodes is defined
        if (totalEpisodes) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'totalEpisodes' }, totalEpisodes),
            });
        }
        //check if totalSeasons is defined
        if (totalSeasons) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'totalSeasons' }, totalSeasons),
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
        // build pipeline if filters are defined
        // Only add a $search stage if there's something to search or filter by
        const compound = {};
        if (searchClauses.must.length)
            compound.must = searchClauses.must;
        if (searchClauses.filter.length)
            compound.filter = searchClauses.filter;
        if (Object.keys(compound).length) {
            pipeline.push({
                $search: { index: config_constants_1.TV_SHOW_SEARCH_INDEX, compound },
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
        // get the data from db
        const result = yield tv_show_mode_1.default.aggregate(pipeline);
        // extract the data , pagination and total count from the result
        const data = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.data;
        const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
        const pagination = (0, pagination_1.getPaginationResponse)(totalCount, limit, skip);
        //send response
        res.status(200).json({
            success: true,
            data: {
                tvShows: data,
                pagination,
            },
        });
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, { error: error });
    }
});
exports.filterTvShow = filterTvShow;
//controller to bulk add tv show
const bulkAddTvShow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //start a mongoose transaction session
    const session = yield (0, mongoose_1.startSession)();
    //start transaction
    session.startTransaction();
    try {
        //destructure validated data
        const tvShows = req.validatedData;
        const savedTvShows = [];
        //add all the tv shows to the db
        for (const tvShow of tvShows) {
            //save the tv show
            const savedTvShow = yield (0, add_tv_show_1.addSingleTvShow)(tvShow, session);
            savedTvShows.push(savedTvShow);
        }
        //commit the transaction if all the tv shows are saved
        yield session.commitTransaction();
        //send response
        res.status(200).json({
            success: true,
            data: savedTvShows,
            message: 'Tv shows created successfully',
        });
        //record the added tv shows in history
        (0, history_utils_1.appendNewDoc)(res, savedTvShows);
        next(); //call next middleware
    }
    catch (error) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: error,
            message: (error === null || error === void 0 ? void 0 : error.message) || (0, mongo_errors_1.isDuplicateKeyError)(error)
                ? 'One of the tv show already exists'
                : 'Server down please try again later',
        });
    }
    finally {
        //end the session
        session.endSession();
    }
});
exports.bulkAddTvShow = bulkAddTvShow;
