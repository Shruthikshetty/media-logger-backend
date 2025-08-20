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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const index_1 = require("../index");
const user_model_1 = __importDefault(require("../models/user.model"));
const config_constants_1 = require("../common/constants/config.constants");
const mock_data_1 = require("../__mocks__/mock-data");
describe('User API Integration Tests', () => {
    let mongoServer;
    // Before all tests, create an in-memory MongoDB instance
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        yield mongoose_1.default.connect(mongoUri);
    }));
    // After all tests, disconnect from Mongoose and stop the server
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    // Before each test, clear the database to ensure test isolation
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteMany({});
    }));
    describe('integration test for GET /api/user/all', () => {
        it('should return 200 OK with a list of users and pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            // Seed the database with some test users
            yield user_model_1.default.create(mock_data_1.mockTestUsers);
            //login as admin
            const loginResponse = yield (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send({ email: 'Admin@example.com', password: 'password123' });
            //expect login response
            const token = loginResponse.body.data.token;
            // Make a real HTTP request to the endpoint using supertest
            const response = yield (0, supertest_1.default)(index_1.app)
                .get('/api/user/all')
                .set('Authorization', `Bearer ${token}`);
            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.users.length).toBe(3);
            expect(response.body.data.pagination.limit).toBe(config_constants_1.GET_ALL_USER_LIMITS.limit.default); //default limit
            expect(response.body.data.pagination.start).toBe(config_constants_1.GET_ALL_USER_LIMITS.start.default); //default start
        }));
        it('it should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).get('/api/user/all');
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Unauthorized admin login is required');
        }));
    });
    describe('integration test to get logged in user /api/user', () => {
        it('it should return 200 OK if user is logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            // Seed the database with some test users
            yield user_model_1.default.create(mock_data_1.mockTestUsers);
            //login a user
            const loginResponse = yield (0, supertest_1.default)(index_1.app)
                .post('/api/auth/login')
                .send({ email: 'Admin@example.com', password: 'password123' });
            // check token is valid
            const token = loginResponse.body.data.token;
            // Make a real HTTP request to the endpoint using supertest
            const response = yield (0, supertest_1.default)(index_1.app)
                .get('/api/user')
                .set('Authorization', `Bearer ${token}`);
            //assertions
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('Admin@example.com');
        }));
        it('it should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).get('/api/user');
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Unauthorized login is required');
        }));
    });
});
