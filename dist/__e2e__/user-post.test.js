"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const index_1 = require("../index");
const user_model_1 = __importDefault(require("../models/user.model"));
const mock_data_1 = require("../__mocks__/mock-data");
describe('User API E2E: POST /api/user', () => {
    let mongoServer;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await user_model_1.default.deleteMany({});
        await user_model_1.default.create(mock_data_1.mockTestUsers);
    });
    // New user payload
    const newUser = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'password123',
    };
    it('should create a new user', async () => {
        // Perform POST
        const res = await (0, supertest_1.default)(index_1.app).post('/api/user').send(newUser);
        // Assertion
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('charlie@example.com');
    });
    it('Should show user exist error when same user is added ', async () => {
        // add a user
        await user_model_1.default.create(newUser);
        //Perform POST with the same user
        const res = await (0, supertest_1.default)(index_1.app).post('/api/user').send(newUser);
        //Assertion
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User already exists');
    });
});
