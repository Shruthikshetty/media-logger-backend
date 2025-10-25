import supertest from 'supertest';
import { app } from '..';
import { mockTestGames, mockTestUsers } from '../__mocks__/mock-data';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Game from '../models/game.model';

describe('all the games delete related endpoints', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;
  let gameId1: string;
  let gameId2: string;

  //crete in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    //connect to mongo
    await mongoose.connect(mongoUri);
    //create users
    await User.create(mockTestUsers);
    //create games
    const games: any = await Game.create(mockTestGames);
    gameId1 = games[0]._id.toString();
    gameId2 = games[1]._id.toString();
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

  describe('delete single game DELETE /api/game/:id', () => {
    it('should delete a single game', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/${gameId1}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      // assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(mockTestGames[0].title);
    });

    it('should return 404 if game not found', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/${new mongoose.Types.ObjectId()}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      // assertions
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Game does not exist/);
    });

    it('should return 400 if invalid game id', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/invalid-id`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      // assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid game id/);
    });

    it('should return 401 for unauthenticated user', async () => {
      // delete the created id
      const res = await supertest(app).delete(`/api/game/${gameId1}`);
      // assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });
  });

  describe('delete bulk games DELETE /api/game/bulk', () => {
    it('should delete bulk games with 200', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/bulk`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({ gameIds: [gameId2] });
      // assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted successfully/i);
      expect(res.body.data).toEqual(
        expect.objectContaining({ deletedCount: 1 })
      );
    });

    it('should return 401 for unauthenticated user', async () => {
      // delete the created id
      const res = await supertest(app).delete(`/api/game/bulk`);
      // assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should return 400 if invalid game id', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/bulk`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({ gameIds: ['invalid-id'] });
      // assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid game id/);
    });
    it('should return 404 if game not found', async () => {
      // login user
      await loginUser();

      // delete the created id
      const res = await supertest(app)
        .delete(`/api/game/bulk`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({ gameIds: [new mongoose.Types.ObjectId()] });
      // assertions
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/No matching games found/);
    });
  });
});
