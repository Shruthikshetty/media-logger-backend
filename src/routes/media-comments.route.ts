/**
 * This @file contains all the routes for media comments
 */

import { Router } from 'express';
import { addMediaComment } from '../controllers/media-comment.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaCommentSchema } from '../common/validation-schema/media-comment/add-comment';

//initialize router
const route = Router();

// route to add a comment
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaCommentSchema),
  addMediaComment
);

//export all the routes
export default route;
