/**
 * @file contains all the recommendation related services
 */

import { Router } from 'express';
import {
  getHealth,
  getSimilarGames,
  getSimilarMovies,
} from '../controllers/recommend.controller';

// initialize router
const route = Router();

//health check route
route.get('/health', getHealth);

//get similar games
route.get('/similar-games/:id', getSimilarGames);

//get similar movies (10 is predefined currently)
route.get('/similar-movies/:id', getSimilarMovies);

//export all the routes
export default route;
