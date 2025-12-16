/**
 * @file contains all the routes related to discovery of media specific to user
 */

import { Router } from 'express';
import {
  getDiscoverGames,
  getDiscoverMovies,
  getDiscoverTVSeries,
} from '../controllers/discover.controller';
import { optionalAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

// discover games with user entries mapped for games
route.get('/games', optionalAuth(), getDiscoverGames);

// discover movies with user entries mapped for movies
route.get('/movies', optionalAuth(), getDiscoverMovies);

// discover tv series with user entries mapped for tv series
route.get('/tv-show', optionalAuth(), getDiscoverTVSeries);

//export all routes
export default route;
