/**
 * This will combine all the routes to be imported in the index
 */

import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import movieRoutes from './movie.route';
import gameRoutes from './game.route';
import tvShowRoutes from './tv-show.route';

//initialize router
const route = Router();

//User routes
route.use('/user', userRoutes);

//Auth routes
route.use('/auth', authRoutes);

//Movie routes
route.use('/movie', movieRoutes);

//Game routes
route.use('/game', gameRoutes);

//TV Show routes
route.use('/tv-show', tvShowRoutes);

// export all the routes
export default route;
