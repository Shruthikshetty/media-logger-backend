/**
 * @file contains all the controllers related to recommendation routes
 */

import { Request, Response } from 'express';
import { Endpoints } from '../common/constants/endpoints.constants';
import axios from 'axios';
import { RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT } from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';
import {
  GetSimilarGamesResponse,
  GetSimilarMoviesResponse,
  GetSimilarTvShowResponse,
} from '../types/recommendation-ms-types';
import Game from '../models/game.model';
import Movie from '../models/movie.model';
import TVShow from '../models/tv-show.model';
import { getSimilarMedia } from '../common/utils/get-similar-media';

//check the health of the recommendation ms
export const getHealth = async (_req: Request, res: Response) => {
  try {
    //get the health from the recommendation ms
    const response = await axios.get(Endpoints.recommender.health, {
      timeout: RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT,
      // Let all HTTP statuses resolve so we can handle non‑200 explicitly
      validateStatus: () => true,
    });

    // if we receive a 200 status code
    if (response.status === 200) {
      res.status(200).json({
        success: true,
        message: 'recommender service is running',
      });
      return;
    }

    // in case we don't get a success response
    res.status(500).json({
      success: false,
      message: 'recommender service is down',
    });
  } catch (err) {
    // handle time out error
    if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
      handleError(res, {
        statusCode: 504,
        message: 'recommender service is down',
      });
      return;
    }
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//recommend similar games
export const getSimilarGames = async (req: Request, res: Response) => {
  getSimilarMedia<GetSimilarGamesResponse>(req, res, {
    endpoint: Endpoints.recommender.games,
    mediaType: 'game',
    model: Game,
    responseField: 'similar_games',
  });
};

//recommend similar movies
export const getSimilarMovies = async (req: Request, res: Response) => {
  getSimilarMedia<GetSimilarMoviesResponse>(req, res, {
    endpoint: Endpoints.recommender.movies,
    mediaType: 'movie',
    model: Movie,
    responseField: 'similar_movies',
  });
};

//recommend similar tv show
export const getSimilarTvShow = async (req: Request, res: Response) => {
  getSimilarMedia<GetSimilarTvShowResponse>(req, res, {
    endpoint: Endpoints.recommender.shows,
    mediaType: 'tv show',
    model: TVShow,
    responseField: 'similar_tv_shows',
  });
};
