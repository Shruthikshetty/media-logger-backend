"use strict";
/**
 * @file contains all the controller related to analytics
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardAdminAnalytics = void 0;
const date_1 = require("../common/utils/date");
const handle_error_1 = require("../common/utils/handle-error");
const game_model_1 = __importDefault(require("../models/game.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const tv_show_model_1 = __importDefault(require("../models/tv-show.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const analytics_1 = require("../common/utils/analytics");
//admin dashboard analytics data
const dashboardAdminAnalytics = async (req, res) => {
    try {
        //get total counts of movies , users , tv-show , games
        const [totalUsers, totalMovies, totalTvShows, totalGames] = await Promise.all([
            user_model_1.default.countDocuments(),
            movie_model_1.default.countDocuments(),
            tv_show_model_1.default.countDocuments(),
            game_model_1.default.countDocuments(),
        ]);
        //get total count of users in current month
        const totalUsersInMonth = await user_model_1.default.countDocuments({
            createdAt: { $gte: (0, date_1.getDaysAgo)(30).toDate() },
        });
        //get total count of movies , users , tv-show , games added in last month
        const [totalUsersInLastMonth, totalMoviesInLastMonth, totalTvShowsInLastMonth, totalGamesInLastMonth,] = await Promise.all([
            user_model_1.default.countDocuments({
                createdAt: {
                    $gte: (0, date_1.getDaysAgo)(60).toDate(),
                    $lte: (0, date_1.getDaysAgo)(30).toDate(),
                },
            }),
            movie_model_1.default.countDocuments({
                createdAt: {
                    $gte: (0, date_1.getDaysAgo)(60).toDate(),
                    $lte: (0, date_1.getDaysAgo)(30).toDate(),
                },
            }),
            tv_show_model_1.default.countDocuments({
                createdAt: {
                    $gte: (0, date_1.getDaysAgo)(60).toDate(),
                    $lte: (0, date_1.getDaysAgo)(30).toDate(),
                },
            }),
            game_model_1.default.countDocuments({
                createdAt: {
                    $gte: (0, date_1.getDaysAgo)(60).toDate(),
                    $lte: (0, date_1.getDaysAgo)(30).toDate(),
                },
            }),
        ]);
        //get total count of movies , users , tv-show , games added in last 30 days
        const [moviesCountLast30Days, tvShowsCountLast30Days, gamesCountLast30Days,] = await Promise.all([
            //aggregate movies
            movie_model_1.default.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: (0, date_1.getDaysAgo)(29).toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                                timezone: 'UTC',
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]),
            //aggregate tv-shows
            tv_show_model_1.default.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: (0, date_1.getDaysAgo)(29).toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                                timezone: 'UTC',
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]),
            game_model_1.default.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: (0, date_1.getDaysAgo)(29).toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                                timezone: 'UTC',
                            },
                        },
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);
        // Merge the results into a single data structure
        const dailyDataMap = new Map();
        (0, analytics_1.processContentDayWise)(moviesCountLast30Days, 'movies', dailyDataMap);
        (0, analytics_1.processContentDayWise)(tvShowsCountLast30Days, 'tvShows', dailyDataMap);
        (0, analytics_1.processContentDayWise)(gamesCountLast30Days, 'games', dailyDataMap);
        const currentMonthData = [];
        //generate day wise data for past 30 days
        for (let i = 30; i >= 0; i--) {
            const targetDate = (0, date_1.getDaysAgo)(i);
            const dateString = targetDate.utc().format('YYYY-MM-DD');
            // Get data from the map or default to zeros if no media was added on that day
            const dataForDay = dailyDataMap.get(dateString) || {
                movies: 0,
                tvShows: 0,
                games: 0,
            };
            currentMonthData.push({
                date: targetDate.toDate(),
                weekday: targetDate.format('ddd'),
                movies: dataForDay.movies,
                tvShows: dataForDay.tvShows,
                games: dataForDay.games,
            });
        }
        //extract weekly data for past 7 days
        const weeklyData = currentMonthData.slice(-7);
        //get total count of movies, tv-show , games added in last month from the current month data
        const totalMoviesInMonth = currentMonthData.reduce((acc, curr) => acc + curr.movies, 0);
        const totalTvShowsInMonth = currentMonthData.reduce((acc, curr) => acc + curr.tvShows, 0);
        const totalGamesInMonth = currentMonthData.reduce((acc, curr) => acc + curr.games, 0);
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
                    users: (0, analytics_1.calculateChangeBetweenTwoNumbers)(totalUsersInLastMonth, totalUsersInMonth),
                    movies: (0, analytics_1.calculateChangeBetweenTwoNumbers)(totalMoviesInLastMonth, totalMoviesInMonth),
                    tvShows: (0, analytics_1.calculateChangeBetweenTwoNumbers)(totalTvShowsInLastMonth, totalTvShowsInMonth),
                    games: (0, analytics_1.calculateChangeBetweenTwoNumbers)(totalGamesInLastMonth, totalGamesInMonth),
                },
            },
        });
    }
    catch (err) {
        //handle any unexpected errors
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.dashboardAdminAnalytics = dashboardAdminAnalytics;
