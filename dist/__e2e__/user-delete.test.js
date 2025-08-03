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
const mock_data_1 = require("../__mocks__/mock-data");
const lodash_1 = require("lodash");
describe('User API E2E: DELETE /api/user/:id', () => {
    let mongoServer;
    let userId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteMany({});
        const users = yield user_model_1.default.create(mock_data_1.mockTestUsers);
        userId = users[1]._id.toString(); // Bob
    }));
    it('should allow an admin to delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Admin login
        const loginRes = yield (0, supertest_1.default)(index_1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        const token = loginRes.body.data.token;
        // delete the first user
        const res = yield (0, supertest_1.default)(index_1.app)
            .delete(`/api/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/deleted successfully/i);
    }));
    it('should allow user to delete his own account', () => __awaiter(void 0, void 0, void 0, function* () {
        // User login
        const loginRes = yield (0, supertest_1.default)(index_1.app).post('/api/auth/login').send({
            email: mock_data_1.mockTestUsers[0].email,
            password: mock_data_1.mockTestUsers[0].password,
        });
        //expect token to be present
        const token = loginRes.body.data.token;
        //delete the logged in user
        const res = yield (0, supertest_1.default)(index_1.app)
            .delete(`/api/user`)
            .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/deleted successfully/i);
        expect(res.body.data).toEqual(expect.objectContaining((0, lodash_1.omit)(mock_data_1.mockTestUsers[0], ['password'])));
    }));
    it('should reject deletion when unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.app).delete(`/api/user/${userId}`);
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
    }));
});
