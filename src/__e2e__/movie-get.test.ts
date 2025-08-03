import supertest from 'supertest';
import { app } from '..';
import { mockTestMovies } from '../__mocks__/mock-data';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Movie from '../models/movie.model';

describe('Movie API Integration Tests GET /api/movie', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let movieId: string;

  //crete in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    //connect to mongo
    await mongoose.connect(mongoUri);
    // push the movies mock data to mongo
    const movies: any = await Movie.insertMany(mockTestMovies);
    movieId = movies[0]._id.toString();
  });

  //clean up mongo
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  describe('get all movies GET /api/movie/all', () => {
    it('should return all movies ', async () => {
      const res = await supertest(app).get('/api/movie');

      //assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.movies.length).toBe(mockTestMovies.length);
    });
  });

  describe('get specific movie GET /api/movie/:id', () => {
    it('should return specific movie', async () => {
      const res = await supertest(app).get(`/api/movie/${movieId}`);

      //assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(mockTestMovies[0].title);
    });

    it('should return 404 if movie not found', async () => {
      const res = await supertest(app).get(
        `/api/movie/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Movie not found/);
    });

    it('should return 400 if invalid movie id', async () => {
      const res = await supertest(app).get(`/api/movie/invalid-id`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid movie id/);
    });
  });
});
