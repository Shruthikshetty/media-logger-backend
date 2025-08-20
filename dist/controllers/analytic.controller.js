"use strict";
/**
 * @file contains all the controller related to analytics
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardAdminAnalytics = void 0;
const date_1 = require("../common/utils/date");
const handle_error_1 = require("../common/utils/handle-error");
const game_model_1 = __importDefault(require("../models/game.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const tv_show_mode_1 = __importDefault(require("../models/tv-show.mode"));
const user_model_1 = __importDefault(require("../models/user.model"));
const analytics_1 = require("../common/utils/analytics");
const moment_1 = __importDefault(require("moment"));
//admin dashboard analytics data
const dashboardAdminAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get total counts of movies , users , tv-show , games
        const [totalUsers, totalMovies, totalTvShows, totalGames] = yield Promise.all([
            user_model_1.default.countDocuments(),
            movie_model_1.default.countDocuments(),
            tv_show_mode_1.default.countDocuments(),
            game_model_1.default.countDocuments(),
        ]);
        //get total count of users in current month
        const totalUsersInMonth = yield user_model_1.default.countDocuments({
            createdAt: { $gte: (0, date_1.getDaysAgo)(30).toDate() },
        });
        //get total count of movies , users , tv-show , games added in last month
        const [totalUsersInLastMonth, totalMoviesInLastMonth, totalTvShowsInLastMonth, totalGamesInLastMonth,] = yield Promise.all([
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
            tv_show_mode_1.default.countDocuments({
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
        const currentMonthData = [];
        //generate day wise data for current month(past ~30days)
        for (let i = 0; i < (0, moment_1.default)().daysInMonth(); i++) {
            //get target date
            const targetDate = (0, date_1.getDaysAgo)(i);
            //get start and end of day
            const startOfDay = targetDate.clone().startOf('day');
            const endOfDay = targetDate.clone().endOf('day');
            //get movie , tv-show , game count
            const [movies, tvShows, games] = yield Promise.all([
                movie_model_1.default.countDocuments({
                    createdAt: {
                        $gte: startOfDay.toDate(),
                        $lte: endOfDay.toDate(),
                    },
                }),
                tv_show_mode_1.default.countDocuments({
                    createdAt: {
                        $gte: startOfDay.toDate(),
                        $lte: endOfDay.toDate(),
                    },
                }),
                game_model_1.default.countDocuments({
                    createdAt: {
                        $gte: startOfDay.toDate(),
                        $lte: endOfDay.toDate(),
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
        //extract weekly data from the current month data
        const weeklyData = currentMonthData.slice(0, 7);
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
});
exports.dashboardAdminAnalytics = dashboardAdminAnalytics;
