"use strict";
/**
 * @file holds the controller related to tv-episode
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEpisodeById = exports.deleteEpisodeById = exports.getEpisodeById = exports.addEpisode = void 0;
const api_error_1 = require("../common/utils/api-error");
const get_episode_1 = require("../common/utils/get-episode");
const handle_error_1 = require("../common/utils/handle-error");
const history_utils_1 = require("../common/utils/history-utils");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const tv_episode_1 = __importDefault(require("../models/tv-episode"));
const tv_season_1 = __importDefault(require("../models/tv-season"));
//controller to add a episode to a season
const addEpisode = async (req, res, next) => {
    try {
        // check if the season exists
        const season = await tv_season_1.default.findById(req.validatedData.season)
            .lean()
            .exec();
        if (!season) {
            throw new api_error_1.ApiError(404, 'Season not found');
        }
        //create a new episode
        const newEpisode = new tv_episode_1.default(req.validatedData);
        //save the episode
        const savedEpisode = await newEpisode.save();
        //return the saved episode
        res.status(201).json({
            success: true,
            data: savedEpisode,
            message: 'Episode created successfully',
        });
        // record the saved episode in history
        (0, history_utils_1.appendNewDoc)(res, savedEpisode);
        // call next middleware
        next();
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            statusCode: err?.statusCode || 500,
            message: err?.message,
        });
    }
};
exports.addEpisode = addEpisode;
//controller to get a episode by id
const getEpisodeById = async (req, res) => {
    try {
        // get id from params
        const { id } = req.params;
        // if id is not a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid episode id', statusCode: 400 });
            return;
        }
        //get query param fullDetails
        const { fullDetails } = req.query;
        //find the episode by id
        const episode = await (0, get_episode_1.getEpisodeDetailsById)(id, fullDetails);
        //in case episode is not found
        if (!episode) {
            (0, handle_error_1.handleError)(res, { message: 'Episode not found', statusCode: 404 });
            return;
        }
        // Send response
        res.status(200).json({
            success: true,
            data: episode,
        });
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: err?.message,
            statusCode: err?.statusCode,
        });
    }
};
exports.getEpisodeById = getEpisodeById;
//controller to delete a episode by id
const deleteEpisodeById = async (req, res, next) => {
    try {
        // get id from params
        const { id } = req.params;
        // if id is not a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid episode id', statusCode: 400 });
            return;
        }
        //delete the episode
        const deletedEpisode = await tv_episode_1.default.findByIdAndDelete(id).lean().exec();
        // in case episode is not deleted
        if (!deletedEpisode) {
            (0, handle_error_1.handleError)(res, { message: 'Episode does not exist', statusCode: 404 });
            return;
        }
        // return the deleted episode
        res.status(200).json({
            success: true,
            data: deletedEpisode,
            message: 'Episode deleted successfully',
        });
        //record the deleted episode in history
        (0, history_utils_1.appendOldDoc)(res, deletedEpisode);
        // call next middleware
        next();
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.deleteEpisodeById = deleteEpisodeById;
//controller to update a episode by id
const updateEpisodeById = async (req, res, next) => {
    try {
        // get id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid episode id', statusCode: 400 });
            return;
        }
        //check if the episode exists
        const episode = await tv_episode_1.default.findById(id).lean().exec();
        if (!episode) {
            (0, handle_error_1.handleError)(res, { message: 'Episode does not exist', statusCode: 404 });
            return;
        }
        //find and update the episode by id
        const updatedEpisode = await tv_episode_1.default.findByIdAndUpdate(id, req.validatedData, {
            new: true,
            runValidators: true,
            context: 'query',
        })
            .lean()
            .exec();
        // in case episode is not updated
        if (!updatedEpisode) {
            (0, handle_error_1.handleError)(res, {
                message: 'Episode does not exist / failed to update',
                statusCode: 500,
            });
            return;
        }
        // return the updated episode
        res.status(200).json({
            success: true,
            data: updatedEpisode,
            message: 'Episode updated successfully',
        });
        //store the updated episode in history
        (0, history_utils_1.appendOldAndNewDoc)({ res, oldValue: episode, newValue: updatedEpisode });
        next();
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'Episode already exists'
                : 'Server down please try again later',
        });
    }
};
exports.updateEpisodeById = updateEpisodeById;
