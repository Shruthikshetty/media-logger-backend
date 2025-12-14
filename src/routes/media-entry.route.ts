/**
 * This @file contains all the routes related to media entry
 */

import { Router } from 'express';
import {
  addNewMediaEntry,
  getAllUserMediaEntries,
  updateUserMediaEntry,
} from '../controllers/media-entry.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaEntrySchema } from '../common/validation-schema/media-entry/add-media-entry';
import { UpdateMediaEntrySchema } from '../common/validation-schema/media-entry/update-media-entry';

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

//update a user media entry
route.patch(
  '/:id',
  requireAuth(),
  validateReq(UpdateMediaEntrySchema),
  updateUserMediaEntry
);

//export all the routes
export default route;
