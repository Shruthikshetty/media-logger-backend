"use strict";
/**
 * This @file contains all the routes for media comments
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_comment_controller_1 = require("../controllers/media-comment.controller");
const require_auth_1 = require("../common/middleware/require-auth");
const handle_validation_1 = require("../common/middleware/handle-validation");
const add_comment_1 = require("../common/validation-schema/media-comment/add-comment");
//initialize router
const route = (0, express_1.Router)();
// route to add a comment
route.post('/', (0, require_auth_1.requireAuth)(), (0, handle_validation_1.validateReq)(add_comment_1.AddMediaCommentSchema), media_comment_controller_1.addMediaComment);
//route to get all comments
route.get('/', media_comment_controller_1.getMediaComments);
//export all the routes
exports.default = route;
