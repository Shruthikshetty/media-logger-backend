"use strict";
/**
 * This @file contains all the controllers related to media entry
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMediaEntriesWithFilters = exports.deleteUserMediaEntry = exports.updateUserMediaEntry = exports.getMediaEntryByMedia = exports.getMediaEntryById = exports.getAllUserMediaEntries = exports.addNewMediaEntry = void 0;
const config_constants_1 = require("../common/constants/config.constants");
const handle_error_1 = require("../common/utils/handle-error");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const pagination_1 = require("../common/utils/pagination");
const validate_data_1 = require("../common/utils/validate-data");
const get_media_entry_1 = require("../common/validation-schema/media-entry/get-media-entry");
const media_entry_1 = __importDefault(require("../models/media-entry"));
//controller to add a new media entry
const addNewMediaEntry = async (req, res) => {
    try {
        //get validated data
        const data = req.validatedData;
        // create a new media entry
        const newMediaEntry = new media_entry_1.default({
            user: req.userData._id,
            ...data,
        });
        // save the media entry
        const savedMediaEntry = await newMediaEntry.save();
        // in case media entry is not saved
        if (!savedMediaEntry) {
            (0, handle_error_1.handleError)(res, { message: 'Media entry creation failed' });
            return;
        }
        // return the saved media entry
        res.status(201).json({
            success: true,
            data: savedMediaEntry,
            message: 'Media entry created successfully',
        });
    }
    catch (err) {
        const isDuplicate = (0, mongo_errors_1.isDuplicateKeyError)(err);
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: err,
            statusCode: isDuplicate ? 409 : 500,
            message: isDuplicate
                ? 'You have already logged this media to your collection.'
                : 'Media entry creation failed',
        });
    }
};
exports.addNewMediaEntry = addNewMediaEntry;
//get all the user media entries
const getAllUserMediaEntries = async (req, res) => {
    try {
        // get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_MEDIA_ENTRY_LIMITS);
        //get user id
        const userId = req.userData?._id;
        // validate optional fields
        const optionalQuery = get_media_entry_1.GetAllUserMediaEntrySchema.safeParse(req.query)?.data;
        // build the query
        const query = optionalQuery
            ? {
                ...optionalQuery,
                user: userId,
            }
            : {
                user: userId,
            };
        //get all the user media entries
        const [mediaEntries, total] = await Promise.all([
            media_entry_1.default.find(query)
                .limit(limit)
                .skip(start)
                .populate('mediaItem')
                .lean()
                .exec(),
            media_entry_1.default.countDocuments(query),
        ]);
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // return the media entries
        res.status(200).json({
            success: true,
            data: {
                mediaEntries,
                pagination: pagination,
            },
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.getAllUserMediaEntries = getAllUserMediaEntries;
//get media entry by id
const getMediaEntryById = async (req, res) => {
    try {
        // get media entry id
        const { id } = req.params;
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid media entry id', statusCode: 400 });
            return;
        }
        // get the media entry
        const mediaEntry = await media_entry_1.default.findOne({
            _id: id,
            user: req.userData?._id,
        })
            .populate('mediaItem')
            .lean()
            .exec();
        // in case media entry is not found
        if (!mediaEntry) {
            (0, handle_error_1.handleError)(res, { message: 'Media entry not found', statusCode: 404 });
            return;
        }
        // return the media entry
        res.status(200).json({
            success: true,
            data: mediaEntry,
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.getMediaEntryById = getMediaEntryById;
//get by media id
const getMediaEntryByMedia = async (req, res) => {
    try {
        // validate and get mediaItem , onModel from query params
        const validatedQuery = (0, validate_data_1.validateDataUsingZod)(get_media_entry_1.GetSingleMediaByIdSchema, req.query, res);
        //return if validation fails
        if (!validatedQuery)
            return;
        const { mediaItem, onModel } = validatedQuery;
        // get the media entry
        const mediaEntry = await media_entry_1.default.findOne({
            user: req.userData?._id,
            onModel,
            mediaItem,
        })
            .populate('mediaItem')
            .lean()
            .exec();
        // in case media entry is not found
        if (!mediaEntry) {
            (0, handle_error_1.handleError)(res, { message: 'Media entry not found', statusCode: 404 });
            return;
        }
        // return the media entry
        res.status(200).json({
            success: true,
            data: mediaEntry,
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.getMediaEntryByMedia = getMediaEntryByMedia;
//update a user media entry
const updateUserMediaEntry = async (req, res) => {
    try {
        // get media entry id
        const { id } = req.params;
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid media entry id', statusCode: 400 });
            return;
        }
        // update the media entry
        const updatedMediaEntry = await media_entry_1.default.findOneAndUpdate({ _id: id, user: req.userData?._id }, req.validatedData, // new data
        {
            new: true,
        })
            .lean()
            .exec();
        // in case media entry is not updated
        if (!updatedMediaEntry) {
            (0, handle_error_1.handleError)(res, { message: 'Media entry not found', statusCode: 404 });
            return;
        }
        // return the updated media entry
        res.status(200).json({
            success: true,
            data: updatedMediaEntry,
            message: 'Media entry updated successfully',
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.updateUserMediaEntry = updateUserMediaEntry;
//delete a user media entry
const deleteUserMediaEntry = async (req, res) => {
    try {
        // get media entry id
        const { id } = req.params;
        if (!(0, mongo_errors_1.isMongoIdValid)(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid media entry id', statusCode: 400 });
            return;
        }
        // delete the media entry
        const deletedMediaEntry = await media_entry_1.default.findOneAndDelete({
            _id: id,
            user: req.userData?._id,
        })
            .lean()
            .exec();
        // in case media entry is not deleted
        if (!deletedMediaEntry) {
            (0, handle_error_1.handleError)(res, { message: 'Media entry not found', statusCode: 404 });
            return;
        }
        // return the deleted media entry
        res.status(200).json({
            success: true,
            data: deletedMediaEntry,
            message: 'Media entry deleted successfully',
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.deleteUserMediaEntry = deleteUserMediaEntry;
// get user entries will all filters
const getUserMediaEntriesWithFilters = async (req, res) => {
    try {
        // get the filter from validated req
        const { limit, page, onModel, rating, sortBy, sortOrder, status } = req.validatedData;
        // define a query
        const query = { user: req.userData._id };
        //if onModel is present
        if (onModel)
            query.onModel = onModel;
        //if status is present
        if (status)
            query.status = status;
        //if rating is present
        if (rating)
            query.rating = { $gte: rating };
        // get the media entries
        let mongooseQuery = media_entry_1.default.find(query).sort({
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        });
        let skip;
        //if limit is present
        if (limit) {
            skip = (page - 1) * limit;
            mongooseQuery = mongooseQuery.limit(limit).skip(skip);
        }
        //get all the media entries
        const [mediaEntries, total] = await Promise.all([
            mongooseQuery.populate('mediaItem').lean().exec(),
            media_entry_1.default.countDocuments(query),
        ]);
        let pagination = undefined;
        if (limit) {
            //get pagination details
            pagination = (0, pagination_1.getPaginationResponse)(total, limit, skip);
        }
        // return the media entries
        res.status(200).json({
            success: true,
            data: {
                mediaEntries,
                pagination,
            },
        });
    }
    catch (err) {
        //handle unexpected errors
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.getUserMediaEntriesWithFilters = getUserMediaEntriesWithFilters;
