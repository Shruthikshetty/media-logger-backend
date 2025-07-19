/**
 * @file contains all the routes related to tv show
 */

import { Router } from 'express';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddTvShowZodSchema } from '../common/validation-schema/tv-show/add-tv-show';
import { addTvShow } from '../controllers/tv-show.controller';
import { addSeason } from '../controllers/tv-season.controller';
import { AddSeasonZodSchema } from '../common/validation-schema/tv-show/add-season';

//initialize router
const route = Router();

//Route to a add a tv-show
route.post(
  '/',
  requireAuth('admin'),
  validateReq(AddTvShowZodSchema),
  addTvShow
);

//Route to add a season to a tv-show
route.post('/season', requireAuth('admin'), validateReq(AddSeasonZodSchema) , addSeason);

//Route to add a Episode to a season
route.post('/episode', () => {
  // in progress
});

//export all the routes
export default route;
