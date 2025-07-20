import Episode from '../../models/tv-episode';
import Season from '../../models/tv-season';
import TVShow from '../../models/tv-show.mode';

/**
 * @description Get all the TV shows with pagination, with optional full details
 *              of seasons and episodes.
 * @param {string} fullDetails - Whether to include full details of seasons and
 *                              episodes.
 * @param {number} start - The page number to start from.
 * @param {number} limit - The number of items per page.
 * @returns  An array of TV shows and the total count of TV
 *                              shows.
 */
export const getTvShowDetailsById = async (
  fullDetails: string,
  start: number,
  limit: number
) => {
  if (fullDetails === 'true') {
    // Get all the TV shows with additional details of seasons and episodes
    const [tvShows, total] = await Promise.all([
      TVShow.find().skip(start).limit(limit).lean().exec(),
      TVShow.countDocuments(),
    ]);

    // Process each TV show to add nested seasons and episodes
    const tvShowsWithDetails = await Promise.all(
      tvShows.map(async (tvShow) => {
        // Find all seasons for this TV show
        const seasons = await Season.find({ tvShow: tvShow._id }).lean().exec();

        // Add episodes to each season
        const seasonsWithEpisodes = await Promise.all(
          seasons.map(async (season) => {
            const episodes = await Episode.find({ season: season._id })
              .lean()
              .exec();
            return {
              ...season,
              episodes,
            };
          })
        );

        return {
          ...tvShow,
          seasons: seasonsWithEpisodes,
        };
      })
    );

    return [tvShowsWithDetails, total];
  } else {
    // get all the tv shows with out additional details
    const [tvShows, total] = await Promise.all([
      TVShow.find().skip(start).limit(limit).lean().exec(),
      TVShow.countDocuments(),
    ]);

    return [tvShows, total];
  }
};
