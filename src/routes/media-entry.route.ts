/**
 * This @file contains all the routes related to media entry
 */

import { Router } from 'express';
import { addNewMediaEntry } from '../controllers/media-entry.controller';

//initialize router
const route = Router();

// add a new media entry

route.post('/', addNewMediaEntry);

//export all the routes
export default route;
