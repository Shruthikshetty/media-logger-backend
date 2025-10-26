/**
 * This @file contains a middleware that records the history of actions performed by a user.
 * update , delete , create
 */
import { CustomResponse, ValidatedRequest } from '../../types/custom-types';
import History from '../../models/history.model';
import { generateHistoryTitle, getHistoryMethod } from '../utils/history-utils';
import { logger } from '../utils/logger';
//types
export type EntityType =
  | 'Game'
  | 'Movie'
  | 'Episode'
  | 'Season'
  | 'User'
  | 'Tv Show';

export const recordHistory = (entity: EntityType, bulk: boolean = false) => {
  return (req: ValidatedRequest<{}>, res: CustomResponse) => {
    // track history once response is sent
    res.on('finish', async () => {
      // only track success responses 2XX
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return;
      }
      // in case user is not logged in
      if (!req.userData) {
        return;
      }
      // get user id
      const { _id } = req.userData!;

      // in case user id is not found
      if (!_id) {
        return;
      }

      const action = getHistoryMethod(req.method);
      try {
        // create a new history
        const newHistory = new History({
          action,
          user: _id,
          title: generateHistoryTitle(action, entity, bulk),
          oldValue: res?.oldValue,
          newValue: res?.newValue,
          entityType: entity,
          entityId: res?.newValue?._id, // no need to store old value id since they are invalid after deletion
          bulk,
        });

        // save the history
        await newHistory.save();
      } catch (error) {
        logger.error(' failed to store history %s', error);
      }
    });
  };
};
