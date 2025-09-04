import request from 'supertest';
import { app } from '../index';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { mockTestUsers } from '../__mocks__/mock-data';
import User from '../models/user.model';
import supertest from 'supertest';

describe('POST /api/movie', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;

  // Connect to a new in-memory database before running any tests.
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    //create users
    await User.create(mockTestUsers);
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
  describe('Add single movie POST /api/movie', () => {
    it('should create a new movie when given valid data', async () => {
      const movieData = {
        title: 'Inception',
        directors: ['Christopher Nolan'],
        releaseYear: 2010,
        genre: ['Sci-Fi', 'Thriller'],
        description: 'E2E game ',
        runTime: 200,
        status: 'released',
        ageRating: 16,
        releaseDate: new Date().toISOString(),
      };

      //login user
      await loginUser();

      //make api call
      const response = await request(app)
        .post('/api/movie')
        .send(movieData)
        .set('Authorization', `Bearer ${token}`);

      // Check that the response body contains the created movie data
      expect(response.status).toBe(201);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.title).toBe(movieData.title);
      expect(response.body.data.directors[0]).toBe('Christopher Nolan');
    });

    it('should return a 400 validation error if the title is missing', async () => {
      const movieData = {
        director: 'Christopher Nolan',
        releaseYear: 2010,
      };

      //login user
      await loginUser();

      // make api call
      const response = await request(app)
        .post('/api/movie')
        .send(movieData)
        .set('Authorization', `Bearer ${token}`);

      //assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Title is required/);
    });
    it('should return 401 for unauthenticated user', async () => {
      const res = await supertest(app).post('/api/movie').send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });
  });
});
