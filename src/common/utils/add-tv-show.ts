import TVShow from '../../models/tv-show.mode';
import { AddTvShowZodType } from '../validation-schema/tv-show/add-tv-show';
import { ClientSession } from 'mongoose';
import { ApiError } from './api-error';
import Episode, { IEpisode } from '../../models/tv-episode';
import Season, { ISeason } from '../../models/tv-season';

/**
 * Adds a single tv show to the database along with its seasons and episodes if present
 * @param {AddTvShowZodType} tvShowData - The data to be saved for the tv show pass the validated data.
 * @param {ClientSession} session - The mongoose session to be used for the transaction.
 * @returns - The saved tv show with its seasons and episodes if present.
 * @throws {ApiError} - If the tv show is not saved, a 500 error is thrown.
 * @throws {ApiError} - If a season is not saved, a 500 error is thrown.
 * @throws {ApiError} - If an episode is not saved, a 500 error is thrown.
 */
export const addSingleTvShow = async (
  tvShowData: AddTvShowZodType,
  session: ClientSession
) => {
  //destructure the season and rest of the tv show details
  const { seasons, ...restTvDetails } = tvShowData;

  // create a new tv show
  const newTvShow = new TVShow(restTvDetails);

  // save the tv show
  const saveTvShow = await newTvShow.save({ session });

  // in case tv show is not saved
  if (!saveTvShow) {
    throw new ApiError(500, 'Tv show creation failed');
  }

  // in case there are seasons
  let savedSeasons: ISeason[] = [];
  let savedEpisodes: IEpisode[] = [];

  if (seasons && seasons.length > 0) {
    for (const seasonData of seasons) {
      // extract episodes
      const { episodes, ...seasonDetails } = seasonData;
      // create a new season
      const newSeason = new Season({
        tvShow: saveTvShow._id,
        ...seasonDetails,
      });
      // save the season
      const savedSeason = await newSeason.save({ session });

      // in case season is not saved
      if (!savedSeason) {
        throw new ApiError(500, `${seasonData.title} creation failed`);
      }

      savedSeasons.push(savedSeason);

      // in case there are episodes
      if (episodes && episodes.length > 0) {
        for (const episodeData of episodes) {
          // create a new episode
          const newEpisode = new Episode({
            season: savedSeason._id,
            ...episodeData,
          });
          // save the episode
          const savedEpisode = await newEpisode.save({ session });
          if (!savedEpisode) {
            throw new ApiError(500, `${episodeData.title} creation failed`);
          }
          savedEpisodes.push(savedEpisode);
        }
      }
    }
  }
  /**
   * return the saved tv show with seasons and episodes
   * {
   *  ...,
   *  seasons:[
   *    {
   *    ...,
   *    episodes:[
   *      ...
   *    }
   *  ]
   * }
   */
  return {
    ...saveTvShow.toObject(),
    seasons: savedSeasons.map((season) => ({
      ...season.toObject(),
      episodes: savedEpisodes.filter(
        (episode) =>
          episode.season.toString() === season.toObject()._id.toString()
      ),
    })),
  };
};
