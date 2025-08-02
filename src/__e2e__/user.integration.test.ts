import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';
import User from '../models/user.model';
import { GET_ALL_USER_LIMITS } from '../common/constants/config.constants';

describe('User API Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  // Before all tests, create an in-memory MongoDB instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // After all tests, disconnect from Mongoose and stop the server
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Before each test, clear the database to ensure test isolation
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('integration test for GET /api/user/all', () => {
    it('should return 200 OK with a list of users and pagination', async () => {
      // Seed the database with some test users
      const testUsers = [
        { name: 'Alice', email: 'alice@example.com', password: 'password123' },
        { name: 'Bob', email: 'bob@example.com', password: 'password123' },
        {
          name: 'Admin',
          email: 'Admin@example.com',
          password: 'password123',
          role: 'admin',
        },
      ];
      // create all the users
      await User.create(testUsers);

      //login as admin
      const loginResponse = await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'Admin@example.com', password: 'password123' });

      //expect login response
      const token = loginResponse.body.data.token;

      // Make a real HTTP request to the endpoint using supertest
      const response = await supertest(app)
        .get('/api/user/all')
        .set('Authorization', `Bearer ${token}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBe(3);
      expect(response.body.data.pagination.limit).toBe(
        GET_ALL_USER_LIMITS.limit.default
      ); //default limit
      expect(response.body.data.pagination.start).toBe(
        GET_ALL_USER_LIMITS.start.default
      ); //default start
    });
  });
});
