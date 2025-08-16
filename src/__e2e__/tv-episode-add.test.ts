import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../models/user.model';
import {
  createMockEpisode,
  mockTestSeason,
  mockTestUsers,
} from '../__mocks__/mock-data';
import supertest from 'supertest';
import { app } from '..';
import Season from '../models/tv-season';

describe('tv episode add related endpoints POST /api/tv-show/episode', () => {
  //initialize mongo server
  let mongoServer: MongoMemoryServer;
  let token: string;
  let seasonId: string;

  // Connect to a new in-memory database before running any tests.
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    //create users
    await User.create(mockTestUsers);
    // add a mock season
    const season: any = await Season.create(mockTestSeason);
    seasonId = season._id.toString();
  });

  // Remove and close the db and server.
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
  it('should add a new episode to a season', async () => {
    // log in as admin
    await loginUser();

    //create a mock episode
    const episode = createMockEpisode({ season: seasonId });

    const res = await supertest(app)
      .post(`/api/tv-show/episode`)
      .send(episode)
      .set('Authorization', `Bearer ${token}`);

    //assertions
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.season).toBe(seasonId);
    expect(res.body.data.title).toBe(episode.title);
  });

  it('should return 400 for missing required fields', async () => {
    //log in as admin
    await loginUser();

    const res = await supertest(app)
      .post(`/api/tv-show/episode`)
      .send({ seasonId: 8263872 })
      .set('Authorization', `Bearer ${token}`);

    //assertions
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Season ref id must be string/);
  });

  it('should return 401 if unauthenticated', async () => {
    const res = await supertest(app).post(`/api/tv-show/episode`).send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Unauthorized/);
  });

  it('should return 400 if season id is invalid', async () => {
    //log in as admin
    await loginUser();
    const res = await supertest(app)
      .post(`/api/tv-show/episode`)
      .send(createMockEpisode({ season: 'invalid-season-id' }))
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid season id/i);
  });

  it("should return 400 if season doesn't exist", async () => {
    //log in as admin
    await loginUser();
    const res = await supertest(app)
      .post(`/api/tv-show/episode`)
      .send(createMockEpisode({ season: new mongoose.Types.ObjectId() }))
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Season not found/i);
  });
});
