import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { mockTestMovies, mockTestUsers } from '../__mocks__/mock-data';
import User from '../models/user.model';
import Movie from '../models/movie.model';
import supertest from 'supertest';
import { app } from '..';

describe('movies delete related endpoints', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;
  let movieId1: string;
  let movieId2: string;
  let movieId3: string;

  // Connect to a new in-memory database before running any tests.
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    //create users
    await User.create(mockTestUsers);
    // create movies mock data
    const movies: any = await Movie.insertMany(mockTestMovies);
    movieId1 = movies[0]._id.toString();
    movieId2 = movies[1]._id.toString();
    movieId3 = movies[2]._id.toString();
  });

  const loginUser = async () => {
    //log in as admin
    const loginRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'Admin@example.com', password: 'password123' });

    //get token
    token = loginRes.body.data.token;
  };

  // Remove and close the db and server.
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('single delete using id DELETE /api/movie/:id', () => {
    it('should allow an admin to delete a movie', async () => {
      await loginUser();
      // delete the first movie
      const res = await supertest(app)
        .delete(`/api/movie/${movieId1}`)
        .set('Authorization', `Bearer ${token}`);

      //assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(mockTestMovies[0].title);
    });

    it('should reject deletion when unauthenticated', async () => {
      const res = await supertest(app).delete(`/api/movie/${movieId1}`);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should return 404 if movie not found', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .delete(`/api/movie/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch('Movie dose not exist');
    });

    it('should return 400 if invalid movie id', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .delete(`/api/movie/invalid-id`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch('Invalid movie id');
    });
  });

  describe('bulk delete using ids DELETE /api/movie/bulk', () => {
    it('should allow an admin to delete multiple movies', async () => {
      await loginUser();
      // delete the first movie
      const res = await supertest(app)
        .delete(`/api/movie/bulk`)
        .set('Authorization', `Bearer ${token}`)
        .send({ movieIds: [movieId2] });

      console.log(res.body);

      //assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deletedCount).toBe(1);
    });

    it('should reject bulk deletion when unauthenticated', async () => {
      const res = await supertest(app).delete(`/api/movie/bulk`);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should return 400 if invalid movie id', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .delete(`/api/movie/bulk`)
        .set('Authorization', `Bearer ${token}`)
        .send({ movieIds: ['invalid-id'] });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch('Invalid movie id');
    });

    it('should return 404 if movie not found', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .delete(`/api/movie/bulk`)
        .set('Authorization', `Bearer ${token}`)
        .send({ movieIds: [new mongoose.Types.ObjectId()] });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch('No movies found');
    });

    it('it should return 200 in case of partial delete when one of the ids is not existing ', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .delete(`/api/movie/bulk`)
        .set('Authorization', `Bearer ${token}`)
        .send({ movieIds: [movieId3, new mongoose.Types.ObjectId()] });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deletedCount).toBe(1);
      expect(res.body.message).toMatch(
        /Some movies could not be deleted \(IDs not found or already deleted\)/
      );
    });
  });
});
