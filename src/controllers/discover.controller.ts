/**
 * @file contains all the controllers related to discover route
 */

import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import {
  GET_ALL_GAMES_LIMITS,
  GET_ALL_MOVIES_LIMITS,
  GET_ALL_TV_SHOW_LIMITS,
} from '../common/constants/config.constants';
import Game from '../models/game.model';
import Movie from '../models/movie.model';
import TVShow from '../models/tv-show.model';
import { getDiscoverItems } from '../common/utils/get-discover-media';

// controller to get discover games
export const getDiscoverGames = async (
  req: ValidatedRequest<null>,
  res: Response
) =>
  getDiscoverItems(req, res, {
    MediaModel: Game,
    onModel: 'Game',
    mediaKey: 'games',
    limits: GET_ALL_GAMES_LIMITS,
  });

// controller to get discover movies
export const getDiscoverMovies = async (
  req: ValidatedRequest<null>,
  res: Response
) =>
  getDiscoverItems(req, res, {
    MediaModel: Movie,
    onModel: 'Movie',
    mediaKey: 'movies',
    limits: GET_ALL_MOVIES_LIMITS,
  });

// controller to get discover tv series
export const getDiscoverTVSeries = async (
  req: ValidatedRequest<null>,
  res: Response
) =>
  getDiscoverItems(req, res, {
    MediaModel: TVShow,
    onModel: 'TVShow',
    mediaKey: 'tvShows',
    limits: GET_ALL_TV_SHOW_LIMITS,
  });
