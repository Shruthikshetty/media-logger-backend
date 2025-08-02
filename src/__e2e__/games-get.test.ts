import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Game from '../models/game.model';
import { mockTestGames } from '../__mocks__/mock-data';
import supertest from 'supertest';
import { app } from '..';

describe('all games get related endpoints ', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let gameId: string;

  //crete in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    //connect to mongo
    await mongoose.connect(mongoUri);
    // push the games mock data to mongo
    const games: any = await Game.insertMany(mockTestGames);
    gameId = games[0]._id.toString();
    //index the games collection
    await Game.createIndexes();
  });

  // clean up mongo
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('get all games  GET /api/game', () => {
    it('should return all games', async () => {
      const res = await supertest(app).get('/api/game');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.games.length).toBe(mockTestGames.length);
      expect(res.body.data.pagination.limit).toBe(20);
    });
  });

  describe('get specific games GET /api/game/:id', () => {
    it('should return specific game', async () => {
      const res = await supertest(app).get(`/api/game/${gameId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(mockTestGames[0].title);
    });

    it('should return 404 if game not found', async () => {
      const res = await supertest(app).get(
        `/api/game/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Game not found/);
    });

    it('should return 400 if invalid game id', async () => {
      const res = await supertest(app).get(`/api/game/invalid-id`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid game id/);
    });
  });
});
