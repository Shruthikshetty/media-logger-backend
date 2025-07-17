/**
 * @file contains all the routes related to tv show
 */

import { Router } from 'express';
import { addTvShow } from '../controllers/tv-season.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddTvShowZodSchema } from '../common/validation-schema/tv-show/add-tv-show';

//initialize router
const route = Router();

//Route to a add a tv-show
route.post(
  '/',
  requireAuth('admin'),
  validateReq(AddTvShowZodSchema),
  addTvShow
);

//Route to add a Episode to a season
route.post('/episode', () => {
  // in progress
});

//export all the routes
export default route;
