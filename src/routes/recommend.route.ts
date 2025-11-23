/**
 * @file contains all the recommendation related services
 */

import { Router } from 'express';
import {
  getHealth,
  getSimilarGames,
  getSimilarMovies,
  getSimilarTvShow,
} from '../controllers/recommend.controller';

// initialize router
const route = Router();

//health check route
route.get('/health', getHealth);

//get similar games (10 is predefined currently)
route.get('/similar-games/:id', getSimilarGames);

//get similar movies (10 is predefined currently)
route.get('/similar-movies/:id', getSimilarMovies);

//get similar tv shows (10 is predefined currently)
route.get('/similar-shows/:id', getSimilarTvShow);

//export all the routes
export default route;
