"use strict";
/**
 * @this file contains all the  controller's for media comments
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMediaCommentById = exports.deleteMediaCommentById = exports.getMediaCommentById = exports.getMediaComments = exports.addMediaComment = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const convex_config_1 = __importDefault(require("../common/config/convex.config"));
const media_logger_convex_api_services_1 = require("media-logger-convex-api-services");
const mongo_errors_1 = require("../common/utils/mongo-errors");
const model_constants_1 = require("../common/constants/model.constants");
//controller to add a new comment
const addMediaComment = async (req, res) => {
    try {
        const validatedData = req.validatedData;
        //let's create a new comment
        const mockComment = {
            entityId: validatedData.entityId,
            entityType: validatedData.entityType,
            user: req.userData?._id.toString(),
            comment: validatedData.comment,
            username: req.userData?.name,
            profileImg: req.userData?.profileImg,
        };
        //call convex mutation!
        const commentId = await convex_config_1.default.mutation(media_logger_convex_api_services_1.api.services.comments.createMediaCommentMutation, mockComment);
        res.status(201).json({
            success: true,
            data: { commentId },
            message: 'Comment added successfully',
        });
    }
    catch (err) {
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.addMediaComment = addMediaComment;
//get media comments by id
const getMediaComments = async (req, res) => {
    try {
        // get the mock entity id and entity type from params
        const { entityId, entityType, limit, cursor } = req.query;
        // validate params
        if (!entityId || (0, mongo_errors_1.isMongoIdValid)(entityId) === false) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid entity id', statusCode: 400 });
            return;
        }
        if (!entityType || !model_constants_1.HISTORY_ENTITY.includes(entityType)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid entity type', statusCode: 400 });
            return;
        }
        // parse limit
        let parsedLimit = Number(limit);
        if (!limit || isNaN(parsedLimit)) {
            parsedLimit = undefined;
        }
        // call convex query!
        const comments = await convex_config_1.default.query(media_logger_convex_api_services_1.api.services.comments.getMediaCommentsQuery, {
            entityId: entityId,
            entityType,
            limit: parsedLimit,
            cursor,
        });
        //@TODO: send response in required format
        // send the response
        res.status(200).json({
            success: true,
            data: comments,
        });
    }
    catch (err) {
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getMediaComments = getMediaComments;
//get media comment by id
const getMediaCommentById = async (req, res) => {
    try {
        // get if from param
        const { id } = req.params;
        if (!id) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid comment id', statusCode: 400 });
            return;
        }
        // call convex query
        const comment = await convex_config_1.default.query(media_logger_convex_api_services_1.api.services.comments.getMediaCommentById, {
            id: id,
        });
        if (!comment) {
            (0, handle_error_1.handleError)(res, { message: 'Comment not found', statusCode: 404 });
            return;
        }
        // send the response
        res.status(200).json({
            success: true,
            data: comment,
        });
    }
    catch (err) {
        //check for any validation error
        if (err?.toString()?.includes('ArgumentValidationError')) {
            (0, handle_error_1.handleError)(res, {
                message: 'Invalid comment id',
                statusCode: 400,
            });
            return;
        }
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getMediaCommentById = getMediaCommentById;
//delete media comment by id
const deleteMediaCommentById = async (req, res) => {
    try {
        // get if from param
        const { id } = req.params;
        if (!id) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid comment id', statusCode: 400 });
            return;
        }
        //check if comment exists or not
        const comment = await convex_config_1.default.query(media_logger_convex_api_services_1.api.services.comments.getMediaCommentById, {
            id: id,
        });
        if (!comment) {
            (0, handle_error_1.handleError)(res, { message: 'Comment not found', statusCode: 404 });
            return;
        }
        // call convex mutation
        await convex_config_1.default.mutation(media_logger_convex_api_services_1.api.services.comments.deleteMediaCommentById, {
            id: id,
        });
        // send the response
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    }
    catch (err) {
        //check for any validation error
        if (err?.toString()?.includes('ArgumentValidationError')) {
            (0, handle_error_1.handleError)(res, {
                message: 'Invalid comment id',
                statusCode: 400,
            });
            return;
        }
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.deleteMediaCommentById = deleteMediaCommentById;
//update media comment by id
const updateMediaCommentById = async (req, res) => {
    try {
        // get user id
        const userId = req.userData?._id;
        // get id from param
        const { id } = req.params;
        // get comment from validated data
        const { comment } = req.validatedData;
        if (!id) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid comment id', statusCode: 400 });
            return;
        }
        //check if comment exists or not
        const oldComment = await convex_config_1.default.query(media_logger_convex_api_services_1.api.services.comments.getMediaCommentById, {
            id: id,
        });
        if (!oldComment) {
            (0, handle_error_1.handleError)(res, { message: 'Comment not found', statusCode: 404 });
            return;
        }
        if (String(oldComment?.user) != String(userId)) {
            (0, handle_error_1.handleError)(res, {
                message: 'only comment owner can update',
                statusCode: 401,
            });
            return;
        }
        // call convex mutation to update comment
        await convex_config_1.default.mutation(media_logger_convex_api_services_1.api.services.comments.updateMediaCommentById, {
            id: id,
            comment,
        });
        // send the response
        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
        });
    }
    catch (err) {
        //check for any validation error
        if (err?.toString()?.includes('ArgumentValidationError')) {
            (0, handle_error_1.handleError)(res, {
                message: 'Invalid comment id',
                statusCode: 400,
            });
            return;
        }
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.updateMediaCommentById = updateMediaCommentById;
