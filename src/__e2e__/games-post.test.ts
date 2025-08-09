import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '..';
import User from '../models/user.model';
import {
  invalidGames,
  mockTestGamesSet2,
  mockTestUsers,
} from '../__mocks__/mock-data';
import path from 'path';
import { writeFileSync, unlinkSync } from 'fs';

describe('Game creation POST /api/game', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;

  //crete in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    //create users
    await User.create(mockTestUsers);
  });

  // clean up mongo
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const loginUser = async () => {
    //log in as admin
    const loginRes = await supertest(app)
      .post('/api/auth/login')
      .send({ email: 'Admin@example.com', password: 'password123' });

    //get token
    token = loginRes.body.data.token;
  };

  describe('Games add single game POST /api/game ', () => {
    it('should create a new game successfully', async () => {
      const payload = {
        title: 'New E2E Game',
        genre: ['Puzzle'],
        platform: 'Web',
        description: 'New E2E Game description',
        status: 'released',
        releaseDate: new Date().toISOString(),
        platforms: [],
      };

      //log in as admin
      await loginUser();

      const res = await supertest(app)
        .post('/api/game')
        .send(payload)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.genre[0]).toBe('Puzzle');
    });

    it('should return 400 for missing required fields', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .post('/api/game')
        .send({ title: '' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Title must be/);
    });

    it('should return 401 for unauthenticated user', async () => {
      const res = await supertest(app).post('/api/game').send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });
  });

  describe('Games add bulk games POST /api/game/bulk', () => {
    it('should create multiple games successfully', async () => {
      //log in as admin
      await loginUser();

      // Construct the file path to your mock JSON data
      const filePath = path.join(__dirname, 'temp-games.json');
      writeFileSync(filePath, JSON.stringify(mockTestGamesSet2), 'utf-8');

      try {
        //call endpoint
        const res = await supertest(app)
          .post('/api/game/bulk')
          .attach('gameDataFile', filePath, 'temp-games.json')
          .set('Authorization', `Bearer ${token}`);

        //assertions
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.added.length).toBe(5);
      } finally {
        //clean up
        unlinkSync(filePath);
      }
    });

    it('should throw 400 for invalid validation error', async () => {
      //log in as admin
      await loginUser();
      // Construct the file path to your mock JSON data
      const filePath = path.join(__dirname, 'temp-games.json');
      writeFileSync(filePath, JSON.stringify(invalidGames), 'utf-8');

      try {
        //call endpoint
        const res = await supertest(app)
          .post('/api/game/bulk')
          .attach('gameDataFile', filePath, 'temp-games.json')
          .set('Authorization', `Bearer ${token}`);

        //assertions
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Genre must be/);
      } finally {
        //clean up
        unlinkSync(filePath);
      }
    });

    it('should return 401 for unauthenticated user', async () => {
      const res = await supertest(app).post('/api/game/bulk').send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should show No file uploaded. Please upload a JSON file', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .post('/api/game/bulk')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(
        /No file uploaded. Please upload a JSON file/
      );
    });
  });
});
