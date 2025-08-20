/**
 * @file contains all the controller related to analytics
 */

import { get } from 'lodash';
import { getDaysAgo } from '../common/utils/date';
import { handleError } from '../common/utils/handle-error';
import Game from '../models/game.model';
import Movie from '../models/movie.model';
import TVShow from '../models/tv-show.mode';
import User from '../models/user.model';
import { ValidatedRequest } from '../types/custom-types';
import { Response } from 'express';
import { calculateChangeBetweenTwoNumbers } from '../common/utils/analytics';

//admin dashboard analytics data
export const dashboardAdminAnalytics = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //get total counts of movies , users , tv-show , games
    const [totalUsers, totalMovies, totalTvShows, totalGames] =
      await Promise.all([
        User.countDocuments(),
        Movie.countDocuments(),
        TVShow.countDocuments(),
        Game.countDocuments(),
      ]);

    //get total counts of movies , users , tv-show , games added in current week
    const [
      totalUsersInWeek,
      totalMoviesInWeek,
      totalTvShowsInWeek,
      totalGamesInWeek,
    ] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: getDaysAgo(7) },
      }),
      Movie.countDocuments({
        createdAt: { $gte: getDaysAgo(7) },
      }),
      TVShow.countDocuments({
        createdAt: { $gte: getDaysAgo(7) },
      }),
      Game.countDocuments({
        createdAt: { $gte: getDaysAgo(7) },
      }),
    ]);

    //get total count of movies , users , tv-show , games added in current month
    const [
      totalUsersInMonth,
      totalMoviesInMonth,
      totalTvShowsInMonth,
      totalGamesInMonth,
    ] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: getDaysAgo(30) },
      }),
      Movie.countDocuments({
        createdAt: { $gte: getDaysAgo(30) },
      }),
      TVShow.countDocuments({
        createdAt: { $gte: getDaysAgo(30) },
      }),
      Game.countDocuments({
        createdAt: { $gte: getDaysAgo(30) },
      }),
    ]);

    //get total count of movies , users , tv-show , games added in last month
    const [
      totalUsersInLastMonth,
      totalMoviesInLastMonth,
      totalTvShowsInLastMonth,
      totalGamesInLastMonth,
    ] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: getDaysAgo(60), $lte: getDaysAgo(30) },
      }),
      Movie.countDocuments({
        createdAt: { $gte: getDaysAgo(60), $lte: getDaysAgo(30) },
      }),
      TVShow.countDocuments({
        createdAt: { $gte: getDaysAgo(60), $lte: getDaysAgo(30) },
      }),
      Game.countDocuments({
        createdAt: { $gte: getDaysAgo(60), $lte: getDaysAgo(30) },
      }),
    ]);

    //send the aggregated data
    res.status(200).json({
      data: {
        totalUsers,
        totalMovies,
        totalTvShows,
        totalGames,
        totalMedia: totalMovies + totalTvShows + totalGames,
        monthlyMediaCount: {
          totalUsers: totalUsersInMonth,
          totalMovies: totalMoviesInMonth,
          totalTvShows: totalTvShowsInMonth,
          totalGames: totalGamesInMonth,
        },
        weeklyMediaCount: {
          totalUsers: totalUsersInWeek,
          totalMovies: totalMoviesInWeek,
          totalTvShows: totalTvShowsInWeek,
          totalGames: totalGamesInWeek,
        },
        percentageChangeFromLastMonth: {
          users: calculateChangeBetweenTwoNumbers(
            totalUsersInLastMonth,
            totalUsersInMonth
          ),
          movies: calculateChangeBetweenTwoNumbers(
            totalMoviesInLastMonth,
            totalMoviesInMonth
          ),
          tvShows: calculateChangeBetweenTwoNumbers(
            totalTvShowsInLastMonth,
            totalTvShowsInMonth
          ),
          games: calculateChangeBetweenTwoNumbers(
            totalGamesInLastMonth,
            totalGamesInMonth
          ),
        },
      },
    });
  } catch (err) {
    //handle any unexpected errors
    handleError(res, {
      error: err,
    });
  }
};
