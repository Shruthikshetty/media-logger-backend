import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';
import User from '../models/user.model';
import { mockTestUsers } from '../__mocks__/mock-data';

describe('User API E2E: PUT/PATCH /api/user', () => {
  let mongoServer: MongoMemoryServer;
  let user2: string;

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
    user2 = users[1]._id.toString();
  });

  describe('update logged in user PATCH ', () => {
    it('should allow logged in user to update name', async () => {
      // Admin login
      const loginRes = await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'Admin@example.com', password: 'password123' });
      const token = loginRes.body.data.token;

      // Update payload
      const updatePayload = { name: 'Alice Updated' };

      const res = await supertest(app)
        .patch(`/api/user`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload);

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alice Updated');
    });

    it('should reject update when unauthenticated', async () => {
      const res = await supertest(app)
        .patch(`/api/user`)
        .send({ name: 'No Auth' });
      // Assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });
  });

  describe('update role only by admin', () => {
    it('should allow admin to update role', async () => {
      // Admin login
      const loginRes = await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'Admin@example.com', password: 'password123' });
      const token = loginRes.body.data.token;

      // Update payload
      const updatePayload = { role: 'admin' };

      const res = await supertest(app)
        .put(`/api/user/role/${user2}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload);

      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('admin');
    });
  });
});
