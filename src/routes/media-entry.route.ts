/**
 * This @file contains all the routes related to media entry
 */

import { Router } from 'express';
import {
  addNewMediaEntry,
  getAllUserMediaEntries,
  updateUserMediaEntry,
  deleteUserMediaEntry,
  getMediaEntryById,
  getMediaEntryByMedia,
  getUserMediaEntriesWithFilters,
} from '../controllers/media-entry.controller';
import { requireAuth } from '../common/middleware/require-auth';
import { validateReq } from '../common/middleware/handle-validation';
import { AddMediaEntrySchema } from '../common/validation-schema/media-entry/add-media-entry';
import { UpdateMediaEntrySchema } from '../common/validation-schema/media-entry/update-media-entry';
import { FilterMediaEntrySchema } from '../common/validation-schema/media-entry/filter-media-entry';

//initialize router
const route = Router();

// add a new media entry
route.post(
  '/',
  requireAuth(),
  validateReq(AddMediaEntrySchema),
  addNewMediaEntry
);

//get user media entries by filter
route.post(
  '/filter',
  requireAuth(),
  validateReq(FilterMediaEntrySchema),
  getUserMediaEntriesWithFilters
);

//get all the user media entries
route.get('/', requireAuth(), getAllUserMediaEntries);

//get single media by media id
route.get('/by-media', requireAuth(), getMediaEntryByMedia);

//get single media entry by id
route.get('/:id', requireAuth(), getMediaEntryById);

//update a user media entry
route.patch(
  '/:id',
  requireAuth(),
  validateReq(UpdateMediaEntrySchema),
  updateUserMediaEntry
);

//delete a user media entry
route.delete('/:id', requireAuth(), deleteUserMediaEntry);

//export all the routes
export default route;
