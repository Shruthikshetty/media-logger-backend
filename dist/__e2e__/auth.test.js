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
describe('Auth API E2E', () => {
    let mongoServer;
    //Start the in-memory server and connect Mongoose
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
    });
    //Disconnect and stop the server
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    describe('Login POST /api/auth/login', () => {
        // Before each test, clear and re-seed the User collection
        beforeEach(async () => {
            await user_model_1.default.deleteMany({});
            await user_model_1.default.create(mock_data_1.mockTestUsers);
        });
        // Test : successful login
        it('should successfully log in a user with correct credentials and return a JWT token', async () => {
            const loginPayload = {
                email: 'Admin@example.com', // From mockTestUsers
                password: 'password123', // From mockTestUsers
            };
            const res = await (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send(loginPayload);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/Login successful/i);
            // Verify that a token is present in the response data
            expect(res.body.data).toHaveProperty('token');
            // You can also check if the token is a non-empty string
            expect(typeof res.body.data.token).toBe('string');
            expect(res.body.data.token.length).toBeGreaterThan(0);
        });
        // Test failure case: wrong password
        it('should return a 401 Unauthorized error for an incorrect password', async () => {
            const loginPayload = {
                email: 'Admin@example.com',
                password: 'wrong-password', // Incorrect password
            };
            const res = await (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send(loginPayload);
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid password/i);
        });
        // Test failure case: user not found
        it('should return a 404 Not Found error for an email that does not exist', async () => {
            const loginPayload = {
                email: 'nonexistent-user@example.com', // This email is not in the DB
                password: 'password123',
            };
            const res = await (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send(loginPayload);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/User not found/i);
        });
        // Test failure case: validation error (from Zod)
        it('should return a 400 Bad Request error if validation fails (e.g., missing password)', async () => {
            const loginPayload = {
                email: 'Admin@example.com', // Password field is missing
            };
            const res = await (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send(loginPayload);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch('Password must be string');
        });
    });
    describe('verify token GET /api/auth/verify', () => {
        // Before each test, clear and re-seed the User collection
        beforeEach(async () => {
            await user_model_1.default.deleteMany({});
            await user_model_1.default.create(mock_data_1.mockTestUsers);
        });
        it('should return 200 if token is valid', async () => {
            const loginRes = await (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send({ email: 'Admin@example.com', password: 'password123' });
            const token = loginRes.body.data.token;
            const res = await (0, supertest_1.default)(index_1.app)
                .get('/api/auth/verify')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toMatch(/Token is valid/i);
        });
        it('should return 401 if token is invalid', async () => {
            const res = await (0, supertest_1.default)(index_1.app)
                .get('/api/auth/verify')
                .set('Authorization', 'Bearer invalid-token');
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid token/i);
        });
    });
});
