import Episode from '../../models/tv-episode';
import Season from '../../models/tv-season';
import { ApiError } from './api-error';
import { isMongoIdValid } from './mongo-errors';

/**
 * @description Get a season by its id. If fullDetails is true, it will also
 *              populate the episodes field.
 * @param {string} seasonId - The id of the season
 * @param {string} [fullDetails='false'] - Whether to populate episodes field
 * @returns The season details
 */
export const getSeasonDetailsById = async (
  seasonId: string,
  fullDetails: string = 'false'
) => {
  // check if id is a valid mongo id
  if (!isMongoIdValid(seasonId)) throw new ApiError(400, 'Invalid season id');

  // get the season details
  switch (fullDetails) {
    case 'true': {
      const [season, episode] = await Promise.all([
        Season.findById(seasonId).lean().exec(),
        Episode.find({ season: seasonId }).lean().exec(),
      ]);
      Season.findById(seasonId).lean().exec();
      // return the season with the episodes
      return { ...season, episodes: episode };
    }
    default:
      return await Season.findById(seasonId).lean().exec();
  }
};
