/**
 * @file contains constants for endpoints
 * these includes all external api endpoints
 */
import dotenv from 'dotenv';

// configure .env
dotenv.config();

// external service base url
const RecommenderMsBase = process.env.RECOMMENDER_MS_URL ?? '';

// aggregate endpoints
export const Endpoints = {
  recommender: {
    games: `${RecommenderMsBase}/similar/games`,
    movies: `${RecommenderMsBase}/similar/movies`,
    shows: `${RecommenderMsBase}/similar/tv-shows`,
    health: `${RecommenderMsBase}`,
  },
};
