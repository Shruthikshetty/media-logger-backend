/**
 * This @file contains all the routes for media comments
 */

import { Router } from 'express';
import { addMediaComment } from '../controllers/media-comment.controller';
import { requireAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

// route to add a comment
route.post('/', requireAuth(), addMediaComment);

//export all the routes
export default route;
