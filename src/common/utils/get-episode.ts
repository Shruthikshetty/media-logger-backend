import Episode from '../../models/tv-episode';
import { ApiError } from './api-error';
import { isMongoIdValid } from './mongo-errors';

/**
 * @description Get an episode by its id. If fullDetails is true, it will also
 *              populate the season and tvShow fields.
 * @param {string} episodeId - The id of the episode
 * @param {string} [fullDetails='false'] - Whether to populate season and tvShow fields
 * @returns The episode details
 */
export const getEpisodeDetailsById = async (
  episodeId: string,
  fullDetails: string | undefined = 'false'
) => {
  // check if id is a valid mongo id
  if (!isMongoIdValid(episodeId)) {
    throw new ApiError(400, 'Invalid episode id');
  }

  switch (fullDetails) {
    case 'true':
      return await Episode.findById(episodeId)
        .populate({
          path: 'season',
          populate: {
            path: 'tvShow',
          },
        })
        .lean()
        .exec();
    default:
      return await Episode.findById(episodeId).lean().exec();
  }
};
