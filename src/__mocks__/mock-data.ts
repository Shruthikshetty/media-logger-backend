/**
 * @file contains data mocks required for testing
 */

import { Types } from 'mongoose';
import { SEASON_STATUS } from '../common/constants/model.constants';

export const mockTestUsers = [
  { name: 'Alice', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob', email: 'bob@example.com', password: 'password123' },
  {
    name: 'Admin',
    email: 'Admin@example.com',
    password: 'password123',
    role: 'admin',
  },
];

export const mockTestGames = Array.from({ length: 5 }).map((_, i) => ({
  title: `Apex Legends Season ${i + 20}`,
  description:
    'Squad up and drop into the arena in this free-to-play battle royale where legendary characters fight for glory',
  genre: ['Battle Royale'],
  releaseDate: new Date(
    Date.now() + i * 1000 * 60 * 60 * 24 * 30
  ).toISOString(),
  posterUrl: `https://example.com/apex-poster-${i + 1}.jpg`,
  backdropUrl: `https://example.com/apex-backdrop-${i + 1}.jpg`,
  isActive: true,
  status: 'released',
  platforms: [
    'PC',
    'PlayStation 5',
    'PlayStation 4',
    'Xbox Series S/X',
    'Xbox One',
    'Nintendo Switch',
  ],
  avgPlaytime: 100 + i * 10,
  developer: 'Respawn Entertainment',
  ageRating: 16,
  trailerYoutubeUrl: `https://www.youtube.com/watch?v=example${i + 6}`,
}));

export const mockTestMovies = Array.from({ length: 10 }).map((_, i) => ({
  title: `Journey to Self ${i + 1}`,
  description: `A young protagonist's path to maturity in a changing world.`,
  averageRating: 8.2 + i * 0.1,
  cast: ['Youth Protagonist', 'Mentor Figure'],
  directors: ['Growth Storyteller'],
  runTime: 105 + i * 10,
  languages: ['english', 'hindi'],
  backdropUrl: `https://example.com/backdrops/journey-to-self-${i + 1}.jpg`,
  isActive: true,
  tags: ['Coming of Age', 'Character-Driven', 'Feel-Good'],
  ageRating: 12,
  youtubeVideoId: `weweqwef-${i + 1}`,
  releaseDate: new Date(
    Date.now() + i * 1000 * 60 * 60 * 24 * 30
  ).toISOString(),
}));

export const mockTestGamesSet2 = Array.from({ length: 5 }).map((_, i) => ({
  title: `Apex Legends Season New ${i + 20}`,
  description:
    'Squad up and drop into the arena in this free-to-play battle royale where legendary characters fight for glory',
  genre: ['Battle Royale'],
  releaseDate: new Date(
    Date.now() + i * 1000 * 60 * 60 * 24 * 30
  ).toISOString(),
  posterUrl: `https://example.com/apex-poster-${i + 1}.jpg`,
  backdropUrl: `https://example.com/apex-backdrop-${i + 1}.jpg`,
  isActive: true,
  status: 'released',
  platforms: [
    'PC',
    'PlayStation 5',
    'PlayStation 4',
    'Xbox Series S/X',
    'Xbox One',
    'Nintendo Switch',
  ],
  avgPlaytime: 100 + i * 10,
  developer: 'Respawn Entertainment',
  ageRating: 16,
  trailerYoutubeUrl: `https://www.youtube.com/watch?v=example${i + 6}`,
}));

export const invalidGames = [
  {
    title: 'Apex Legends Season 20',
    description:
      'Squad up and drop into the arena in this free-to-play battle royale where legendary characters fight for glory',
    genre: ['Battle Royale', 'invalid genre'],
    releaseDate: new Date().toISOString(),
    posterUrl: 'https://example.com/apex-poster.jpg',
    backdropUrl: 'https://example.com/apex-backdrop.jpg',
    isActive: true,
    status: 'released',
    platforms: [
      'PC',
      'PlayStation 5',
      'PlayStation 4',
      'Xbox Series X',
      'Xbox One',
      'Nintendo Switch',
    ],
    avgPlaytime: 100,
    developer: 'Respawn Entertainment',
    ageRating: 16,
  },
];

export const mockTestSeason = {
  _id: new Types.ObjectId(), // Random ObjectId
  tvShow: new Types.ObjectId(),
  seasonNumber: 1,
  title: 'Season 1: The Beginning',
  description: 'The first season introduces the main characters and storyline.',
  releaseDate: '2025-01-15',
  noOfEpisodes: 10,
  posterUrl: 'https://example.com/posters/season1.jpg',
  seasonRating: 8.5,
  status: SEASON_STATUS[0],
  trailerYoutubeUrl: 'https://youtube.com/watch?v=abcd1234',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const createMockEpisode = (overrides = {}) => ({
  _id: new Types.ObjectId(),
  season: new Types.ObjectId(),
  title: 'Episode 1: A New Beginning',
  description: 'The story begins as new characters are introduced.',
  episodeNumber: 1,
  releaseDate: new Date('2025-01-15').toISOString(),
  runTime: 45,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides, // Override defaults as needed
});
