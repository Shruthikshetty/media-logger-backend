import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';
import User from '../models/user.model';
import { mockTestUsers } from '../__mocks__/mock-users';

describe('User API E2E: POST /api/user', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create(mockTestUsers);
  });

  // New user payload
  const newUser = {
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'password123',
  };

  it('should allow  to create a new user', async () => {
    // Perform POST
    const res = await supertest(app).post('/api/user').send(newUser);

    // Assertion
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('charlie@example.com');
  });

  it('Should show user exist error when same user is added ', async () => {
    // add a user
    await User.create(newUser)

    //Perform POST with the same user
    const res = await supertest(app).post("/api/user").send(newUser);

    //Assertion
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User already exists")
  });
});
