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
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const mock_data_1 = require("../__mocks__/mock-data");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const game_model_1 = __importDefault(require("../models/game.model"));
describe('all the games delete related endpoints', () => {
    //initialize mongo server
    let mongoServer;
    let token;
    let gameId1;
    let gameId2;
    //crete in memory mongo instance
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        //connect to mongo
        yield mongoose_1.default.connect(mongoUri);
        //create users
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
        //create games
        const games = yield game_model_1.default.create(mock_data_1.mockTestGames);
        gameId1 = games[0]._id.toString();
        gameId2 = games[1]._id.toString();
    }));
    // clean up mongo
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
    describe('delete single game DELETE /api/game/:id', () => {
        it('should delete a single game', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/${gameId1}`)
                .set({
                Authorization: `Bearer ${token}`,
            });
            // assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(mock_data_1.mockTestGames[0].title);
        }));
        it('should return 404 if game not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/${new mongoose_1.default.Types.ObjectId()}`)
                .set({
                Authorization: `Bearer ${token}`,
            });
            // assertions
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Game does not exist/);
        }));
        it('should return 400 if invalid game id', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/invalid-id`)
                .set({
                Authorization: `Bearer ${token}`,
            });
            // assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid game id/);
        }));
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app).delete(`/api/game/${gameId1}`);
            // assertions
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
    });
    describe('delete bulk games DELETE /api/game/bulk', () => {
        it('should delete bulk games with 200', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/bulk`)
                .set({
                Authorization: `Bearer ${token}`,
            })
                .send({ gameIds: [gameId2] });
            // assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/deleted successfully/i);
            expect(res.body.data).toEqual(expect.objectContaining({ deleCount: 1 }));
        }));
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app).delete(`/api/game/bulk`);
            // assertions
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
        it('should return 400 if invalid game id', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/bulk`)
                .set({
                Authorization: `Bearer ${token}`,
            })
                .send({ gameIds: ['invalid-id'] });
            // assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid game id/);
        }));
        it('should return 404 if game not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // login user
            yield loginUser();
            // delete the created id
            const res = yield (0, supertest_1.default)(__1.app)
                .delete(`/api/game/bulk`)
                .set({
                Authorization: `Bearer ${token}`,
            })
                .send({ gameIds: [new mongoose_1.default.Types.ObjectId()] });
            // assertions
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/No games found/);
        }));
    });
});
