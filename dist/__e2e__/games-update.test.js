"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mock_data_1 = require("../__mocks__/mock-data");
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const game_model_1 = __importDefault(require("../models/game.model"));
describe('all games get related update endpoints ', () => {
    //initialize mongo server
    let mongoServer;
    let token;
    let gameId1;
    //crete in memory mongo instance
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
        //create users
        await user_model_1.default.create(mock_data_1.mockTestUsers);
        //create games
        const games = await game_model_1.default.create(mock_data_1.mockTestGames);
        gameId1 = games[0]._id.toString();
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
    describe('Games update a game PATCH /api/game/:id', () => {
        it('should update a game successfully', async () => {
            //log in as admin
            await loginUser();
            const res = await (0, supertest_1.default)(__1.app)
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
            const res = await (0, supertest_1.default)(__1.app)
                .patch(`/api/game/${gameId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                title: '',
            });
            //assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Title must be at least 3 characters long/);
        });
        it('should return 401 for unauthenticated user', async () => {
            const res = await (0, supertest_1.default)(__1.app).patch(`/api/game/${gameId1}`).send({
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
            const res = await (0, supertest_1.default)(__1.app)
                .patch(`/api/game/${new mongoose_1.default.Types.ObjectId()}`)
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
            const res = await (0, supertest_1.default)(__1.app)
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
