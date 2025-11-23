/**
 * @file contains all the recommendation related services
 */

import { Router } from 'express';
import {
  getHealth,
  getSimilarGames,
} from '../controllers/recommend.controller';

// initialize router
const route = Router();

//health check route
route.get('/health', getHealth);

//get similar games
route.get('/similar-game/:id', getSimilarGames);

//export all the routes
export default route;
