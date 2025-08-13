import { MongoMemoryServer } from 'mongodb-memory-server';
import { mockTestMovies, mockTestUsers } from '../__mocks__/mock-data';
import User from '../models/user.model';
import Movie from '../models/movie.model';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '..';

describe('Movie update endpoints PATCH /api/movie/:id', () => {
  // Initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;
  let movieId1: string;
  let movieId2: string;

  // Create in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    // Create users
    await User.create(mockTestUsers);
    // Create movies
    const movies: any = await Movie.insertMany(mockTestMovies);
    movieId1 = movies[0]._id.toString();
    movieId2 = movies[1]._id.toString();
  });

  // Clean up mongo
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const loginUser = async () => {
    // Log in as admin
    const loginRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'Admin@example.com', password: 'password123' });

    // Get token
    token = loginRes.body.data.token;
  };

  describe('Successful movie updates', () => {
    it('should update a movie with all valid fields', async () => {
      // Log in as admin
      await loginUser();

      const updateData = {
        title: 'Updated Movie Title',
        description: 'Updated comprehensive description for the movie',
        averageRating: 8.5,
        cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
        directors: ['Christopher Nolan'],
        runTime: 148,
        languages: ['english', 'french'],
        posterUrl: 'https://example.com/updated-poster.jpg',
        backdropUrl: 'https://example.com/updated-backdrop.jpg',
        isActive: true,
        status: 'released',
        tags: ['Cult Classic', 'Award-winning'],
        ageRating: 13,
        trailerYoutubeUrl: 'https://youtube.com/watch?v=updated-trailer',
        releaseDate: new Date('2023-07-21').toISOString(),
      };

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Movie updated successfully');
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.description).toBe(updateData.description);
      expect(res.body.data.averageRating).toBe(updateData.averageRating);
      expect(res.body.data.cast).toEqual(updateData.cast);
      expect(res.body.data.directors).toEqual(updateData.directors);
      expect(res.body.data.runTime).toBe(updateData.runTime);
      expect(res.body.data.languages).toEqual(updateData.languages);
      expect(res.body.data.ageRating).toBe(updateData.ageRating);
      expect(res.body.data.isActive).toBe(updateData.isActive);
      expect(res.body.data.status).toBe(updateData.status);
    });

    it('should update movie with partial data (only title)', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId2}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Partially Updated Title',
        });

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Partially Updated Title');
    });
  });

  describe('Validation error tests', () => {
    it('should return 400 when no fields are provided for update', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/At least one field must be updated/);
    });

    it('should return 400 for invalid average rating (above 10)', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          averageRating: 11.5,
        });

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Average rating can be at most 10/);
    });

    it('should return 400 for invalid status value', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'invalid-status',
        });

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Status must be one of the following/);
    });

    it('should return 400 for invalid tags', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          tags: ['InvalidTag', 'AnotherInvalidTag'],
        });

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Tags must be one of the following/);
    });

    it('should return 400 for invalid release date format', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          releaseDate: 'invalid-date',
        });

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(
        /Release date must be a valid ISO 8601 string/
      );
    });
  });

  describe('Authentication and authorization tests', () => {
    it('should return 401 for unauthenticated user', async () => {
      const res = await supertest(app).patch(`/api/movie/${movieId1}`).send({
        title: 'Updated title without auth',
      });

      // Assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should return 401 for invalid token', async () => {
      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({
          title: 'Updated title with invalid token',
        });

      // Assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });
  });

  describe('Resource not found tests', () => {
    it('should return 404 for non-existent movie ID', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title for non-existent movie',
        });

      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Movie dose not exist/);
    });

    it('should return 400 for invalid movie ID format', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/invalid-id`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title with invalid id',
        });

      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid movie id/);
    });
  });

  describe('Edge cases and data transformation', () => {
    it('should transform languages to lowercase', async () => {
      // Log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          languages: ['ENGLISH', 'HINDI', 'SPANISH'],
        });

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.languages).toEqual(['english', 'hindi', 'spanish']);
    });
  });
});
