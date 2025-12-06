/**
 * This @file contains all the routes for media comments
 */

import { Router } from 'express';
import {
  addMediaComment,
  getMediaComments,
  getMediaCommentById,
  deleteMediaCommentById,
  updateMediaCommentById,
} from '../controllers/media-comment.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaCommentSchema } from '../common/validation-schema/media-comment/add-comment';
import { UpdateMediaCommentSchema } from '../common/validation-schema/media-comment/update-comment';

//initialize router
const route = Router();

// route to add a comment
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaCommentSchema),
  addMediaComment
);

//route to get comment by id
route.get('/:id', getMediaCommentById);

//route to get all comments
route.get('/', getMediaComments);

//route to delete comment by id
route.delete('/:id', requireAuth(), deleteMediaCommentById);

//route to update comment by id
route.put(
  '/:id',
  requireAuth(),
  validateReq(UpdateMediaCommentSchema),
  updateMediaCommentById
);

//export all the routes
export default route;
