"use strict";
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
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        //connect to mongo
        await mongoose_1.default.connect(mongoUri);
        //create users
        await user_model_1.default.create(mock_data_1.mockTestUsers);
        //create games
        const games = await game_model_1.default.create(mock_data_1.mockTestGames);
        gameId1 = games[0]._id.toString();
        gameId2 = games[1]._id.toString();
    });
    // clean up mongo
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
    describe('delete single game DELETE /api/game/:id', () => {
        it('should delete a single game', async () => {
            // login user
            await loginUser();
            // delete the created id
            const res = await (0, supertest_1.default)(__1.app)
                .delete(`/api/game/${gameId1}`)
                .set({
                Authorization: `Bearer ${token}`,
            });
            // assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(mock_data_1.mockTestGames[0].title);
        });
        it('should return 404 if game not found', async () => {
            // login user
            await loginUser();
            // delete the created id
            const res = await (0, supertest_1.default)(__1.app)
                .delete(`/api/game/${new mongoose_1.default.Types.ObjectId()}`)
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
            const res = await (0, supertest_1.default)(__1.app)
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
            const res = await (0, supertest_1.default)(__1.app).delete(`/api/game/${gameId1}`);
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
            const res = await (0, supertest_1.default)(__1.app)
                .delete(`/api/game/bulk`)
                .set({
                Authorization: `Bearer ${token}`,
            })
                .send({ gameIds: [gameId2] });
            // assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/deleted successfully/i);
            expect(res.body.data).toEqual(expect.objectContaining({ deletedCount: 1 }));
        });
        it('should return 401 for unauthenticated user', async () => {
            // delete the created id
            const res = await (0, supertest_1.default)(__1.app).delete(`/api/game/bulk`);
            // assertions
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        });
        it('should return 400 if invalid game id', async () => {
            // login user
            await loginUser();
            // delete the created id
            const res = await (0, supertest_1.default)(__1.app)
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
            const res = await (0, supertest_1.default)(__1.app)
                .delete(`/api/game/bulk`)
                .set({
                Authorization: `Bearer ${token}`,
            })
                .send({ gameIds: [new mongoose_1.default.Types.ObjectId()] });
            // assertions
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/No matching games found/);
        });
    });
});
