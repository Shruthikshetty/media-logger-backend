/**
 * This will combine all the routes to be imported in the index
 */

import { Router } from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import movieRoutes from './movie.route';
import gameRoutes from './game.route';
import tvShowRoutes from './tv-show.route';
import analyticRoutes from './analytic.route';
import uploadRoutes from './upload.route';
import historyRoutes from './history.routes';
import recommendRoutes from './recommend.route';
import mediaCommentRoutes from './media-comments.route';

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

//Analytics routes
route.use('/analytic', analyticRoutes);

//upload routes
route.use('/upload', uploadRoutes);

//history routes
route.use('/history', historyRoutes);

//recommend routes
route.use('/recommend', recommendRoutes);

//media comment route
route.use('/media-comment', mediaCommentRoutes);

// export all the routes
export default route;
