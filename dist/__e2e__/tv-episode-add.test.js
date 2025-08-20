"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        //create users
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
        // add a mock season
        const season = yield tv_season_1.default.create(mock_data_1.mockTestSeason);
        seasonId = season._id.toString();
    }));
    // Remove and close the db and server.
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    const loginUser = () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        const loginRes = yield (0, supertest_1.default)(__1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        //get token
        token = loginRes.body.data.token;
    });
    it('should add a new episode to a season', () => __awaiter(void 0, void 0, void 0, function* () {
        // log in as admin
        yield loginUser();
        //create a mock episode
        const episode = (0, mock_data_1.createMockEpisode)({ season: seasonId });
        const res = yield (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send(episode)
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.season).toBe(seasonId);
        expect(res.body.data.title).toBe(episode.title);
    }));
    it('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send({ seasonId: 8263872 })
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Season ref id must be string/);
    }));
    it('should return 401 if unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).post(`/api/tv-show/episode`).send({});
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
    }));
    it('should return 400 if season id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send((0, mock_data_1.createMockEpisode)({ season: 'invalid-season-id' }))
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid season id/i);
    }));
    it("should return 400 if season doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
            .post(`/api/tv-show/episode`)
            .send((0, mock_data_1.createMockEpisode)({ season: new mongoose_1.default.Types.ObjectId() }))
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Season not found/i);
    }));
});
