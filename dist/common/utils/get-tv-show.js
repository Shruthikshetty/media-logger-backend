'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTvShowDetails = exports.getSeasonsWithEpisodes = void 0;
const tv_episode_1 = __importDefault(require('../../models/tv-episode'));
const tv_season_1 = __importDefault(require('../../models/tv-season'));
const tv_show_mode_1 = __importDefault(require('../../models/tv-show.mode'));
/**
 * @description Get seasons with their episodes for a given TV show
 * @param {ObjectId} tvShowId - The ID of the TV show
 * @returns {Promise<Array>} An array of seasons with nested episodes
 */
const getSeasonsWithEpisodes = (tvShowId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Find all seasons for this TV show
    const seasons = yield tv_season_1.default
      .find({ tvShow: tvShowId })
      .lean()
      .exec();
    // Add episodes to each season
    const seasonsWithEpisodes = yield Promise.all(
      seasons.map((season) =>
        __awaiter(void 0, void 0, void 0, function* () {
          const episodes = yield tv_episode_1.default
            .find({ season: season._id })
            .lean()
            .exec();
          return Object.assign(Object.assign({}, season), { episodes });
        })
      )
    );
    return seasonsWithEpisodes;
  });
exports.getSeasonsWithEpisodes = getSeasonsWithEpisodes;
/**
 * @description Get all the TV shows with pagination, with optional full details
 *              of seasons and episodes.
 * @param {string} fullDetails - Whether to include full details of seasons and
 *                              episodes.
 * @param {number} start - The page number to start from.
 * @param {number} limit - The number of items per page.
 * @returns  An array of TV shows and the total count of TV shows.
 */
const getTvShowDetails = (fullDetails, start, limit) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (fullDetails === 'true') {
      // Get all the TV shows with additional details of seasons and episodes
      const [tvShows, total] = yield Promise.all([
        tv_show_mode_1.default.find().skip(start).limit(limit).lean().exec(),
        tv_show_mode_1.default.countDocuments(),
      ]);
      // Process each TV show to add nested seasons and episodes
      const tvShowsWithDetails = yield Promise.all(
        tvShows.map((tvShow) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const seasonsWithEpisodes = yield (0,
            exports.getSeasonsWithEpisodes)(tvShow._id);
            return Object.assign(Object.assign({}, tvShow), {
              seasons: seasonsWithEpisodes,
            });
          })
        )
      );
      return [tvShowsWithDetails, total];
    } else {
      // get all the tv shows without additional details
      const [tvShows, total] = yield Promise.all([
        tv_show_mode_1.default.find().skip(start).limit(limit).lean().exec(),
        tv_show_mode_1.default.countDocuments(),
      ]);
      return [tvShows, total];
    }
  });
exports.getTvShowDetails = getTvShowDetails;
