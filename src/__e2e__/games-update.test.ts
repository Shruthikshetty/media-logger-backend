import { MongoMemoryServer } from 'mongodb-memory-server';
import { mockTestGames, mockTestUsers } from '../__mocks__/mock-data';
import User from '../models/user.model';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '..';
import Game from '../models/game.model';

describe('all games get related update endpoints ', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;
  let gameId1: string;

  //crete in memory mongo instance
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    //create users
    await User.create(mockTestUsers);
    //create games
    const games: any = await Game.create(mockTestGames);
    gameId1 = games[0]._id.toString();
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

  describe('Games update a game PATCH /api/game/:id', () => {
    it('should update a game successfully', async () => {
      //log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/game/${gameId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title',
        });
      //assertions
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated title');
    });

    it('should return 400 for validation errors', async () => {
      //log in as admin
      await loginUser();

      const res = await supertest(app)
        .patch(`/api/game/${gameId1}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
        });
      //assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(
        /Title must be at least 3 characters long/
      );
    });

    it('should return 401 for unauthenticated user', async () => {
      const res = await supertest(app).patch(`/api/game/${gameId1}`).send({
        title: 'Updated title',
      });
      //assertions
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Unauthorized/);
    });

    it('should return 404 for game not found', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .patch(`/api/game/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title',
        });
      //assertions
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Game not found/);
    });

    it('should return 400 for invalid game id', async () => {
      //log in as admin
      await loginUser();
      const res = await supertest(app)
        .patch(`/api/game/invalid-id`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title',
        });
      //assertions
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid game id/);
    });
  });
});
