/**
 * @file contains data mocks required for e2e testing for user endpoints
 */

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
    'Xbox Series X',
    'Xbox One',
    'Nintendo Switch',
  ],
  avgPlaytime: 100 + i * 10,
  developer: 'Respawn Entertainment',
  ageRating: 16,
  trailerYoutubeUrl: `https://www.youtube.com/watch?v=example${i + 6}`,
}));
