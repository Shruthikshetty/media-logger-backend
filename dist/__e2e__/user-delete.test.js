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
const lodash_1 = require("lodash");
describe('User API E2E: DELETE /api/user/:id', () => {
    let mongoServer;
    let userId;
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
        const users = await user_model_1.default.create(mock_data_1.mockTestUsers);
        userId = users[1]._id.toString(); // Bob
    });
    it('should allow an admin to delete a user', async () => {
        // Admin login
        const loginRes = await (0, supertest_1.default)(index_1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        const token = loginRes.body.data.token;
        // delete the first user
        const res = await (0, supertest_1.default)(index_1.app)
            .delete(`/api/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/deleted successfully/i);
    });
    it('should allow user to delete his own account', async () => {
        // User login
        const loginRes = await (0, supertest_1.default)(index_1.app).post('/api/auth/login').send({
            email: mock_data_1.mockTestUsers[0].email,
            password: mock_data_1.mockTestUsers[0].password,
        });
        //expect token to be present
        const token = loginRes.body.data.token;
        //delete the logged in user
        const res = await (0, supertest_1.default)(index_1.app)
            .delete(`/api/user`)
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/deleted successfully/i);
        expect(res.body.data).toEqual(expect.objectContaining((0, lodash_1.omit)(mock_data_1.mockTestUsers[0], ['password'])));
    });
    it('should reject deletion when unauthenticated', async () => {
        const res = await (0, supertest_1.default)(index_1.app).delete(`/api/user/${userId}`);
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
    });
});
