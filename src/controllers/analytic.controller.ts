/**
 * @file contains all the controller related to analytics
 */

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

    //get total count of users in current month
    const totalUsersInMonth = await User.countDocuments({
      createdAt: { $gte: getDaysAgo(30).toDate() },
    });

    //get total count of movies , users , tv-show , games added in last month
    const [
      totalUsersInLastMonth,
      totalMoviesInLastMonth,
      totalTvShowsInLastMonth,
      totalGamesInLastMonth,
    ] = await Promise.all([
      User.countDocuments({
        createdAt: {
          $gte: getDaysAgo(60).toDate(),
          $lte: getDaysAgo(30).toDate(),
        },
      }),
      Movie.countDocuments({
        createdAt: {
          $gte: getDaysAgo(60).toDate(),
          $lte: getDaysAgo(30).toDate(),
        },
      }),
      TVShow.countDocuments({
        createdAt: {
          $gte: getDaysAgo(60).toDate(),
          $lte: getDaysAgo(30).toDate(),
        },
      }),
      Game.countDocuments({
        createdAt: {
          $gte: getDaysAgo(60).toDate(),
          $lte: getDaysAgo(30).toDate(),
        },
      }),
    ]);

    const currentMonthData: {
      date: Date;
      movies: number;
      tvShows: number;
      games: number;
      weekday: string;
    }[] = [];

    //generate day wise data for past 30 days
    for (let i = 30; i >= 0; i--) {
      //get target date
      const targetDate = getDaysAgo(i);
      //get start and end of day
      const startOfDay = targetDate.clone().startOf('day');
      const endOfDay = targetDate.clone().endOf('day');

      //get movie , tv-show , game count
      const [movies, tvShows, games] = await Promise.all([
        Movie.countDocuments({
          createdAt: {
            $gte: startOfDay.toDate(),
            $lt: endOfDay.toDate(),
          },
        }),
        TVShow.countDocuments({
          createdAt: {
            $gte: startOfDay.toDate(),
            $lt: endOfDay.toDate(),
          },
        }),
        Game.countDocuments({
          createdAt: {
            $gte: startOfDay.toDate(),
            $lt: endOfDay.toDate(),
          },
        }),
      ]);

      //push formatted data
      currentMonthData.push({
        date: targetDate.toDate(),
        movies,
        tvShows,
        games,
        weekday: targetDate.format('ddd'),
      });
    }

    //extract weekly data for past 7 days
    const weeklyData = currentMonthData.slice(-7);

    //get total count of movies, tv-show , games added in last month from the current month data
    const totalMoviesInMonth = currentMonthData.reduce(
      (acc, curr) => acc + curr.movies,
      0
    );
    const totalTvShowsInMonth = currentMonthData.reduce(
      (acc, curr) => acc + curr.tvShows,
      0
    );
    const totalGamesInMonth = currentMonthData.reduce(
      (acc, curr) => acc + curr.games,
      0
    );

    //send the aggregated data
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalTvShows,
        totalGames,
        totalMedia: totalMovies + totalTvShows + totalGames,
        monthlyMediaCount: currentMonthData,
        weeklyMediaCount: weeklyData,
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
