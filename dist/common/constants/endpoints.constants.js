"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoints = void 0;
/**
 * @file contains constants for endpoints
 * these includes all external api endpoints
 */
const dotenv_1 = __importDefault(require("dotenv"));
// configure .env
dotenv_1.default.config();
// external service base url
const RecommenderMsBase = process.env.RECOMMENDER_MS_URL ?? '';
// aggregate endpoints
exports.Endpoints = {
    recommender: {
        games: `${RecommenderMsBase}/similar/games`,
        movies: `${RecommenderMsBase}/similar/movies`,
        shows: `${RecommenderMsBase}/similar/tv-shows`,
        health: `${RecommenderMsBase}`,
    },
};
