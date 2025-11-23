/**
 * @file contains all the controllers related to recommendation routes
 */

import { Request, Response } from 'express';
import { Endpoints } from '../common/constants/endpoints.constants';
import axios from 'axios';
import {
  RECOMMENDER_MS_HEALTH_CHECK_TIMEOUT,
  RECOMMENDER_MS_REQUEST_TIMEOUT,
} from '../common/constants/config.constants';
import { handleError } from '../common/utils/handle-error';
import { isMongoIdValid } from '../common/utils/mongo-errors';
import {
  GetSimilarGamesResponse,
  GetSimilarMoviesResponse,
  GetSimilarTvShowResponse,
} from '../types/recommendation-ms-types';
import Game from '../models/game.model';
import Movie from '../models/movie.model';
import TVShow from '../models/tv-show.mode';

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
  try {
    // get the game id
    const { id } = req.params;
    if (!id || !isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid game id', statusCode: 400 });
      return;
    }

    // get the recommendation from the recommendation ms
    const response = await axios.get<GetSimilarGamesResponse>(
      `${Endpoints.recommender.games}/${id}`,
      {
        timeout: RECOMMENDER_MS_REQUEST_TIMEOUT,
        // Let all HTTP statuses resolve so we can handle non‑200 explicitly
        validateStatus: () => true,
      }
    );
    // extract the response from the recommendation ms
    const { success, similar_games = [] } = response.data;

    if (!success || similar_games?.length < 1) {
      // send the response
      handleError(res, { message: 'No similar games found try again later' });
      return;
    }

    // fetch the full data from games db
    const games = await Game.find({
      _id: { $in: similar_games },
    })
      .lean()
      .exec();

    // send the response
    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//recommend similar movies
export const getSimilarMovies = async (req: Request, res: Response) => {
  try {
    // get the movie id
    const { id } = req.params;
    // validate id
    if (!id || !isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid movie id', statusCode: 400 });
      return;
    }

    // get the recommendation from the recommendation ms
    const response = await axios.get<GetSimilarMoviesResponse>(
      `${Endpoints.recommender.movies}/${id}`,
      {
        timeout: RECOMMENDER_MS_REQUEST_TIMEOUT,
        validateStatus: () => true, // handle non-200 responses explicitly
      }
    );
    // extract the response from the recommendation ms
    const { success, similar_movies = [] } = response.data;

    //in case we don't get a success response or no similar movies
    if (!success || similar_movies?.length < 1) {
      handleError(res, { message: 'No similar movies found try again later' });
      return;
    }

    // fetch the full data from movies db
    const movies = await Movie.find({
      _id: { $in: similar_movies },
    })
      .lean()
      .exec();

    // send the response
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//recommend similar tv show
export const getSimilarTvShow = async (req: Request, res: Response) => {
  try {
    // get tv show id
    const { id } = req.params;
    // validated id
    if (!id || !isMongoIdValid(id)) {
      handleError(res, { message: 'Invalid tv show id', statusCode: 400 });
      return;
    }

    // get the recommendation from the recommendation ms
    const response = await axios.get<GetSimilarTvShowResponse>(
      `${Endpoints.recommender.shows}/${id}`,
      {
        timeout: RECOMMENDER_MS_REQUEST_TIMEOUT,
        validateStatus: () => true, // handle non-200 responses explicitly
      }
    );
    // extract the response from the recommendation ms
    const { success, similar_tv_shows = [] } = response.data;

    //in case we don't get a success response or no similar tv shows
    if (!success || similar_tv_shows?.length < 1) {
      handleError(res, {
        message: 'No similar tv shows found try again later',
      });
      return;
    }

    // fetch the full data from tv shows db
    const tvShows = await TVShow.find({
      _id: { $in: similar_tv_shows },
    })
      .lean()
      .exec();

    // send the response
    res.status(200).json({
      success: true,
      data: tvShows,
    });
  } catch (err) {
    // handle any unexpected error
    handleError(res, {
      error: err,
    });
  }
};
