"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const game_model_1 = __importDefault(require("../models/game.model"));
const mock_data_1 = require("../__mocks__/mock-data");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
describe('all games get related endpoints ', () => {
    //initialize mongo server
    let mongoServer;
    let gameId;
    //crete in memory mongo instance
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        //connect to mongo
        await mongoose_1.default.connect(mongoUri);
        // push the games mock data to mongo
        const games = await game_model_1.default.insertMany(mock_data_1.mockTestGames);
        gameId = games[0]._id.toString();
        //index the games collection
        await game_model_1.default.createIndexes();
    });
    // clean up mongo
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    describe('get all games  GET /api/game', () => {
        it('should return all games', async () => {
            const res = await (0, supertest_1.default)(__1.app).get('/api/game');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.games.length).toBe(mock_data_1.mockTestGames.length);
            expect(res.body.data.pagination.limit).toBe(20);
        });
    });
    describe('get specific games GET /api/game/:id', () => {
        it('should return specific game', async () => {
            const res = await (0, supertest_1.default)(__1.app).get(`/api/game/${gameId}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(mock_data_1.mockTestGames[0].title);
        });
        it('should return 404 if game not found', async () => {
            const res = await (0, supertest_1.default)(__1.app).get(`/api/game/${new mongoose_1.default.Types.ObjectId()}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Game not found/);
        });
        it('should return 400 if invalid game id', async () => {
            const res = await (0, supertest_1.default)(__1.app).get(`/api/game/invalid-id`);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid game id/);
        });
    });
});
