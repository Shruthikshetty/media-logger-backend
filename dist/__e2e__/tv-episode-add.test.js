"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mock_data_1 = require("../__mocks__/mock-data");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const tv_season_1 = __importDefault(require("../models/tv-season"));
describe('tv episode add related endpoints POST /api/tv-show/episode', () => {
    //initialize mongo server
    let mongoServer;
    let token;
    let seasonId;
    // Connect to a new in-memory database before running any tests.
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
        //create users
        await user_model_1.default.create(mock_data_1.mockTestUsers);
        // add a mock season
        const season = await tv_season_1.default.create(mock_data_1.mockTestSeason);
        seasonId = season._id.toString();
    });
    // Remove and close the db and server.
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    const loginUser = async () => {
        //log in as admin
        const loginRes = await (0, supertest_1.default)(__1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        //get token
        token = loginRes.body.data.token;
    };
    it('should add a new episode to a season', async () => {
        // log in as admin
        await loginUser();
        //create a mock episode
        const episode = (0, mock_data_1.createMockEpisode)({ season: seasonId });
        const res = await (0, supertest_1.default)(__1.app)
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
        const res = await (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send({ seasonId: 8263872 })
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Season ref id must be string/);
    });
    it('should return 401 if unauthenticated', async () => {
        const res = await (0, supertest_1.default)(__1.app).post(`/api/tv-show/episode`).send({});
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
    });
    it('should return 400 if season id is invalid', async () => {
        //log in as admin
        await loginUser();
        const res = await (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send((0, mock_data_1.createMockEpisode)({ season: 'invalid-season-id' }))
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid season id/i);
    });
    it("should return 400 if season doesn't exist", async () => {
        //log in as admin
        await loginUser();
        const res = await (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send((0, mock_data_1.createMockEpisode)({ season: new mongoose_1.default.Types.ObjectId() }))
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Season not found/i);
    });
});
