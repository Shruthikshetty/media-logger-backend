/**
 * @file contains data mocks required for testing
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
  tags: ['Coming of Age', 'Character-driven', 'Feel-Good'],
  ageRating: 12,
  trailerYoutubeUrl: `https://youtube.com/watch?v=journey-trailer-${i + 1}`,
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
    'Xbox Series X',
    'Xbox One',
    'Nintendo Switch'
  ],
  avgPlaytime: 100 + i * 10,
  developer: 'Respawn Entertainment',
  ageRating: 16,
  trailerYoutubeUrl: `https://www.youtube.com/watch?v=example${i + 6}`,
}));
