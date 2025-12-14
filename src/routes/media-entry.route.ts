/**
 * This @file contains all the routes related to media entry
 */

import { Router } from 'express';
import {
  addNewMediaEntry,
  getAllUserMediaEntries,
} from '../controllers/media-entry.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaEntrySchema } from '../common/validation-schema/media-entry/add-media-entry';

//initialize router
const route = Router();

// add a new media entry
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaEntrySchema),
  addNewMediaEntry
);

//get all the user media entries
route.get('/', requireAuth(), getAllUserMediaEntries);

//export all the routes
export default route;
