"use strict";
/**
 * @file holds the controller related to tv-episode
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
exports.updateEpisodeById = exports.deleteEpisodeById = exports.getEpisodeById = exports.addEpisode = void 0;
const api_error_1 = require("../common/utils/api-error");
const get_episode_1 = require("../common/utils/get-episode");
const handle_error_1 = require("../common/utils/handle-error");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const tv_episode_1 = __importDefault(require("../models/tv-episode"));
const tv_season_1 = __importDefault(require("../models/tv-season"));
//controller to add a episode to a season
const addEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if the season exists
        const season = yield tv_season_1.default.findById(req.validatedData.season)
            .lean()
            .exec();
        if (!season) {
            throw new api_error_1.ApiError(404, 'Season not found');
        }
        //create a new episode
        const newEpisode = new tv_episode_1.default(req.validatedData);
        //save the episode
        const savedEpisode = yield newEpisode.save();
        //return the saved episode
        res.status(201).json({
            success: true,
            data: savedEpisode,
            message: 'Episode created successfully',
        });
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
            statusCode: (err === null || err === void 0 ? void 0 : err.statusCode) || 500,
            message: err === null || err === void 0 ? void 0 : err.message,
        });
    }
});
exports.addEpisode = addEpisode;
//controller to get a episode by id
const getEpisodeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const episode = yield (0, get_episode_1.getEpisodeDetailsById)(id, fullDetails);
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
            message: err === null || err === void 0 ? void 0 : err.message,
            statusCode: err === null || err === void 0 ? void 0 : err.statusCode,
        });
    }
});
exports.getEpisodeById = getEpisodeById;
//controller to delete a episode by id
const deleteEpisodeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // if id is not a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid episode id', statusCode: 400 });
            return;
        }
        //delete the episode
        const deletedEpisode = yield tv_episode_1.default.findByIdAndDelete(id).lean().exec();
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
    }
    catch (err) {
        //handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.deleteEpisodeById = deleteEpisodeById;
//controller to update a episode by id
const updateEpisodeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id from params
        const { id } = req.params;
        // check if id is a valid mongo id
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid episode id', statusCode: 400 });
            return;
        }
        //find and update the episode by id
        const updatedEpisode = yield tv_episode_1.default.findByIdAndUpdate(id, req.validatedData, {
            new: true,
            runValidators: true,
            context: 'query',
        })
            .lean()
            .exec();
        // in case episode is not updated
        if (!updatedEpisode) {
            (0, handle_error_1.handleError)(res, { message: 'Episode does not exist', statusCode: 404 });
            return;
        }
        // return the updated episode
        res.status(200).json({
            success: true,
            data: updatedEpisode,
            message: 'Episode updated successfully',
        });
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
});
exports.updateEpisodeById = updateEpisodeById;
