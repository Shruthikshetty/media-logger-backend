"use strict";
/**
 * @file holds the controller for tv season
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSeasonById = exports.updateSeason = exports.getSeasonById = exports.addSeason = void 0;
// import
const handle_error_1 = require("../common/utils/handle-error");
const mongoose_1 = require("mongoose");
const tv_season_1 = __importDefault(require("../models/tv-season"));
const tv_episode_1 = __importDefault(require("../models/tv-episode"));
const tv_show_model_1 = __importDefault(require("../models/tv-show.model"));
const get_season_1 = require("../common/utils/get-season");
const api_error_1 = require("../common/utils/api-error");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const history_utils_1 = require("../common/utils/history-utils");
//controller to add a tv season to a tv show
const addSeason = async (req, res, next) => {
    // create a mongo transaction session
    const session = await (0, mongoose_1.startSession)();
    //start transaction
    session.startTransaction();
    try {
        // get the validated data from request
        const { episodes, ...seasonData } = req.validatedData;
        // check if the tv show exists
        const tvShow = await tv_show_model_1.default.findOne({ _id: seasonData.tvShow })
            .lean()
            .exec();
        // in case tv show is not found
        if (!tvShow) {
            throw new Error('Tv show not found');
        }
        // create a new season
        const newSeason = new tv_season_1.default(seasonData);
        // save the create season
        const saveSeason = await newSeason.save({ session });
        // in case season is not saved
        if (!saveSeason) {
            throw new Error('Season creation failed');
        }
        // in case there are episodes
        let savedEpisodes = [];
        if (episodes && episodes.length > 0) {
            for (const episodeData of episodes) {
                // create a new episode
                const newEpisode = new tv_episode_1.default({
                    season: saveSeason._id,
                    ...episodeData,
                });
                // save the create episode
                const saveEpisode = await newEpisode.save({ session });
                // in case episode is not saved
                if (!saveEpisode) {
                    throw new Error(`${episodeData.title}episode creation failed`);
                }
                savedEpisodes.push(saveEpisode);
            }
        }
        // commit the transaction
        await session.commitTransaction();
        const seasonWithEpisodes = {
            ...saveSeason.toObject(),
            episodes: savedEpisodes,
        };
        //send the response
        res.status(201).json({
            success: true,
            data: seasonWithEpisodes,
            message: 'Season added successfully',
        });
        //store the added season for history
        (0, history_utils_1.appendNewDoc)(res, seasonWithEpisodes);
        next();
    }
    catch (err) {
        // if any error abort the transaction
        await session.abortTransaction();
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: err?.message,
        });
    }
    finally {
        //end session
        await session.endSession();
    }
};
exports.addSeason = addSeason;
// controller to get a season by id
const getSeasonById = async (req, res) => {
    try {
        // get id from params
        const { id } = req.params;
        // get the season details
        const season = await (0, get_season_1.getSeasonDetailsById)(id, req.query.fullDetails);
        //if season is not found
        if (!season) {
            throw new api_error_1.ApiError(404, 'Season not found');
        }
        // send the response
        res.status(200).json({ success: true, data: season });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: err?.message,
            statusCode: err?.statusCode,
        });
    }
};
exports.getSeasonById = getSeasonById;
// controller to update a season
const updateSeason = async (req, res, next) => {
    try {
        // get id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid season id', statusCode: 400 });
            return;
        }
        //Check if the season exists
        const season = await tv_season_1.default.findById(id).lean().exec();
        if (!season) {
            (0, handle_error_1.handleError)(res, { message: 'Season does not exist', statusCode: 404 });
            return;
        }
        //find and update the season by id
        const updatedSeason = await tv_season_1.default.findByIdAndUpdate(id, req.validatedData, {
            new: true,
            runValidators: true,
            context: 'query', //validator to exclude the document being updated from its duplication check
        })
            .lean()
            .exec();
        // in case season is not updated
        if (!updatedSeason) {
            (0, handle_error_1.handleError)(res, {
                message: 'Season does not exist / failed to update',
                statusCode: 500,
            });
            return;
        }
        // return the updated season
        res.status(200).json({
            success: true,
            data: updatedSeason,
            message: 'Season updated successfully',
        });
        // record the updated season in history
        (0, history_utils_1.appendOldAndNewDoc)({ res, oldValue: season, newValue: updatedSeason });
        next();
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'Season title already exists'
                : 'Server down please try again later',
        });
    }
};
exports.updateSeason = updateSeason;
//delete a season by id
const deleteSeasonById = async (req, res, next) => {
    // create a mongo transaction session
    const session = await (0, mongoose_1.startSession)();
    //start transaction
    session.startTransaction();
    try {
        // get the id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid season id', statusCode: 400 });
            return;
        }
        // delete the season by id
        const deletedSeason = await tv_season_1.default.findByIdAndDelete(id, { session })
            .lean()
            .exec();
        // in case season is not deleted
        if (!deletedSeason) {
            (0, handle_error_1.handleError)(res, { message: 'Season does not exist', statusCode: 404 });
            return;
        }
        // delete all the episodes of the season
        const deletedEpisodes = await tv_episode_1.default.deleteMany({ season: id }, { session })
            .lean()
            .exec();
        // commit the transaction
        await session.commitTransaction();
        // return the deleted season
        res.status(200).json({
            success: true,
            data: {
                ...deletedSeason,
                episodes: {
                    deletedCount: deletedEpisodes.deletedCount,
                },
            },
            message: 'Season and associated episodes deleted successfully',
        });
        // record the deleted season in history
        (0, history_utils_1.appendOldDoc)(res, deletedSeason);
        next();
    }
    catch (err) {
        // in case of error abort the transaction
        await session.abortTransaction();
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
    finally {
        //end session
        await session.endSession();
    }
};
exports.deleteSeasonById = deleteSeasonById;
