/**
 * @file contains all the routes related to discovery of media specific to user
 */

import { Router } from 'express';
import { getDiscoverGames } from '../controllers/discover.controller';
import { optionalAuth } from '../common/middleware/require-auth';

//initialize router
const route = Router();

// discover games with user entries mapped for games
route.get('/games', optionalAuth(), getDiscoverGames);

//export all routes
export default route;
