import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';
import User from '../models/user.model';
import { mockTestUsers } from '../__mocks__/mock-users';
import { omit } from 'lodash';

describe('User API E2E: DELETE /api/user/:id', () => {
  let mongoServer: MongoMemoryServer;
  let userId: string;

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
    const users: any = await User.create(mockTestUsers);
    userId = users[1]._id.toString(); // Bob
  });

  it('should allow an admin to delete a user', async () => {
    // Admin login
    const loginRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'Admin@example.com', password: 'password123' });
    const token = loginRes.body.data.token;

    // delete the first user
    const res = await supertest(app)
      .delete(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    //assertions
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should allow user to delete his own account', async () => {
    // User login
    const loginRes = await supertest(app).post('/api/auth/login').send({
      email: mockTestUsers[0].email,
      password: mockTestUsers[0].password,
    });

    //expect token to be present
    const token = loginRes.body.data.token;

    //delete the logged in user
    const res = await supertest(app)
      .delete(`/api/user`)
      .set('Authorization', `Bearer ${token}`);

    //assertions
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
    expect(res.body.data).toEqual(expect.objectContaining(omit(mockTestUsers[0], ['password'])));
  });

  it('should reject deletion when unauthenticated', async () => {
    const res = await supertest(app).delete(`/api/user/${userId}`);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Unauthorized/);
  });
});
