import { ClientSession } from 'mongoose';
import Season from '../../models/tv-season';
import { ApiError } from './api-error';
import Episode from '../../models/tv-episode';
import TVShow from '../../models/tv-show.mode';

/**
 * Deletes a tv show by id along with all its associated seasons and episodes.
 *
 * @param {string} tvShowId - The id of the tv show to delete.
 * @param {ClientSession} session - The mongoose session to use for the deletion.
 *
 * @returns An object containing the number of tv shows, seasons and episodes deleted.
 *
 * @throws {ApiError} - If the tv show is not found, a 404 error is thrown.
 */
export const deleteTvShow = async (
  tvShowId: string,
  session: ClientSession
) => {
  //find and delete all the seasons by tv tv id
  const seasons = await Season.find({ tvShow: tvShowId }).lean().exec();

  let episodeDeleteCount = 0;
  let seasonDeleteCount = 0;

  if (seasons.length > 0) {
    //delete all the episodes by season id
    for (const season of seasons) {
      const deletedEpisodes = await Episode.deleteMany(
        { season: season._id },
        { session }
      );
      episodeDeleteCount += deletedEpisodes.deletedCount;
    }

    //delete all the seasons by tv show id
    const deletedSeason = await Season.deleteMany(
      { tvShow: tvShowId },
      { session }
    );
    seasonDeleteCount = deletedSeason.deletedCount;
  }

  //delete the tv show by id
  const deletedTvShow = await TVShow.findByIdAndDelete(tvShowId, { session })
    .lean()
    .exec();

  // in case tv show is not deleted
  if (!deletedTvShow) {
    throw new ApiError(404, `Tv show by id ${tvShowId} not found`);
  }

  return {
    deletedCount: {
      tvShow: 1,
      seasons: seasonDeleteCount,
      episodes: episodeDeleteCount,
    },
  };
};
