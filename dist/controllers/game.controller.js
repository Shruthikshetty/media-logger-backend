"use strict";
/**
 * This file contains the controller related to game
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
exports.filterGames = exports.searchGame = exports.bulkDeleteGames = exports.bulkAddGames = exports.updateGameById = exports.deleteGameById = exports.addGame = exports.getGameById = exports.getAllGames = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const game_model_1 = __importDefault(require("../models/game.model"));
const mongo_errors_1 = require("../common/utils/mongo-errors");
const pagination_1 = require("../common/utils/pagination");
const config_constants_1 = require("../common/constants/config.constants");
//controller to get all the games
const getAllGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get pagination params
    const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_GAMES_LIMITS);
    try {
        //find all the games
        const [games, total] = yield Promise.all([
            game_model_1.default.find()
                .skip(start)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec(),
            game_model_1.default.countDocuments(),
        ]);
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // send response
        res.status(200).json({
            success: true,
            data: {
                games,
                pagination,
            },
        });
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getAllGames = getAllGames;
//controller to get a game by id
const getGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid game id', statusCode: 400 });
            return;
        }
        //find the game by id
        const game = yield game_model_1.default.findById(id).lean().exec();
        // in case game is not found
        if (!game) {
            (0, handle_error_1.handleError)(res, { message: 'Game not found', statusCode: 404 });
            return;
        }
        // Send response
        res.status(200).json({
            success: true,
            data: game,
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getGameById = getGameById;
// controller to add a game
const addGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create a new game
        const newGame = new game_model_1.default(req.validatedData);
        // save the game
        const savedGame = yield newGame.save();
        // in case game is not saved
        if (!savedGame) {
            (0, handle_error_1.handleError)(res, { message: 'Game creation failed' });
            return;
        }
        // return the saved game
        res.status(201).json({
            success: true,
            data: savedGame,
            message: 'Game created successfully',
        });
    }
    catch (err) {
        const isDuplicate = (0, mongo_errors_1.isDuplicateKeyError)(err);
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: isDuplicate ? 'Game already exists' : 'Game creation failed',
            statusCode: isDuplicate ? 409 : 500,
        });
    }
});
exports.addGame = addGame;
//controller to delete a game by id
const deleteGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid game id', statusCode: 400 });
            return;
        }
        // delete the game
        const deletedGame = yield game_model_1.default.findByIdAndDelete((_b = req.params) === null || _b === void 0 ? void 0 : _b.id)
            .lean()
            .exec();
        // in case game is not deleted
        if (!deletedGame) {
            (0, handle_error_1.handleError)(res, { message: 'Game does not exist', statusCode: 404 });
            return;
        }
        // return the deleted game
        res.status(200).json({
            success: true,
            data: deletedGame,
            message: 'Game deleted successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.deleteGameById = deleteGameById;
//controller to update a game
const updateGameById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid game id', statusCode: 400 });
            return;
        }
        //update the game by id
        const updatedGame = yield game_model_1.default.findByIdAndUpdate((_b = req.params) === null || _b === void 0 ? void 0 : _b.id, req.validatedData, {
            new: true,
            runValidators: true,
            context: 'query',
        })
            .lean()
            .exec();
        // in case game is not updated
        if (!updatedGame) {
            (0, handle_error_1.handleError)(res, { message: 'Game not found', statusCode: 404 });
            return;
        }
        // return the updated game
        res.status(200).json({
            success: true,
            data: updatedGame,
            message: 'Game updated successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'Game already exists'
                : 'Server down please try again later',
        });
    }
});
exports.updateGameById = updateGameById;
//controller to bulk add games by taking json
const bulkAddGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // add all games
        const games = yield game_model_1.default.insertMany(req.validatedData, {
            ordered: false, // continuous insertion in case of error
            throwOnValidationError: true,
        });
        // return the added games
        res.status(201).json({
            success: true,
            data: {
                added: games,
                notAdded: [],
            },
            message: 'Games added successfully',
        });
    }
    catch (err) {
        // Extract failed (duplicate) docs from error object
        const notAdded = (err === null || err === void 0 ? void 0 : err.writeErrors)
            ? err.writeErrors.map((e) => { var _a, _b, _c, _d; return (_d = (_b = (_a = e.err) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : (_c = e.err) === null || _c === void 0 ? void 0 : _c.doc) !== null && _d !== void 0 ? _d : {}; })
            : [];
        //err.insertedDocs gives successfully inserted docs
        const added = (err === null || err === void 0 ? void 0 : err.insertedDocs) || [];
        // in case games are added partially
        if (added.length > 0) {
            // return the added games
            res.status(207).json({
                success: true,
                data: {
                    added,
                    notAdded,
                },
                message: 'Games partially added successfully',
            });
            return;
        }
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'All games already exists'
                : 'Server down please try again later',
            statusCode: (0, mongo_errors_1.isDuplicateKeyError)(err) ? 409 : 500,
        });
    }
});
exports.bulkAddGames = bulkAddGames;
//controller to bulk delete games by taking ids
const bulkDeleteGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameIds = req.validatedData.gameIds;
        // delete all games
        const games = yield game_model_1.default.deleteMany({
            _id: { $in: gameIds },
        });
        // in case game is not found
        if (games.deletedCount === 0) {
            (0, handle_error_1.handleError)(res, {
                message: 'No games found',
                statusCode: 404,
            });
            return;
        }
        // return the deleted games
        res.status(200).json({
            success: true,
            data: {
                deleCount: games.deletedCount,
            },
            message: games.deletedCount === gameIds.length
                ? 'All games deleted successfully'
                : 'Some games could not be deleted (IDs not found or already deleted)',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.bulkDeleteGames = bulkDeleteGames;
//controller for search title
const searchGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get query from params
        const { text } = req.query;
        //get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_GAMES_LIMITS);
        //search pipeline (atlas search)
        const pipeline = [
            {
                $search: {
                    index: config_constants_1.GAME_SEARCH_INDEX,
                    text: {
                        query: text,
                        path: ['title'],
                    },
                },
            },
        ];
        // get the games
        const games = yield game_model_1.default.aggregate(pipeline)
            .skip(start)
            .limit(limit)
            .exec();
        //send response
        res.status(200).json({
            success: true,
            data: {
                games,
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
exports.searchGame = searchGame;
//controller for games filter
const filterGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        //destructure the filters from validated data
        const { genre, platforms, status, avgPlaytime, releaseDate, averageRating, page, ageRating, limit, searchText, } = req.validatedData;
        //define filters and pipeline
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
        // if genre is defined
        if (genre) {
            searchClauses.filter.push({
                in: {
                    path: 'genre',
                    value: genre,
                },
            });
        }
        //if platform is defined
        if (platforms) {
            searchClauses.filter.push({
                in: {
                    path: 'platforms',
                    value: platforms,
                },
            });
        }
        //if status is defined
        if (status) {
            searchClauses.filter.push({
                in: {
                    path: 'status',
                    value: status,
                },
            });
        }
        //if avgPlaytime is defined
        if (avgPlaytime) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'avgPlaytime' }, avgPlaytime),
            });
        }
        //if releaseDate is defined
        if (releaseDate) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'releaseDate' }, releaseDate),
            });
        }
        //if ageRating is defined
        if (ageRating) {
            searchClauses.filter.push({
                range: Object.assign({ path: 'ageRating' }, ageRating),
            });
        }
        //if averageRating is defined
        if (averageRating) {
            searchClauses.filter.push({
                range: {
                    path: 'averageRating',
                    gte: averageRating,
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
                $search: { index: config_constants_1.GAME_SEARCH_INDEX, compound },
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
        // get the data from the db
        const result = yield game_model_1.default.aggregate(pipeline);
        // extract the data , pagination and total count from the result
        const data = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.data;
        const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
        const pagination = (0, pagination_1.getPaginationResponse)(totalCount, limit, skip);
        //send response
        res.status(200).json({
            success: true,
            data: {
                games: data,
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
exports.filterGames = filterGames;
