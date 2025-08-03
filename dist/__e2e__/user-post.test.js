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
describe('User API E2E: POST /api/user', () => {
    let mongoServer;
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
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
    }));
    // New user payload
    const newUser = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'password123',
    };
    it('should allow  to create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Perform POST
        const res = yield (0, supertest_1.default)(index_1.app).post('/api/user').send(newUser);
        // Assertion
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('charlie@example.com');
    }));
    it('Should show user exist error when same user is added ', () => __awaiter(void 0, void 0, void 0, function* () {
        // add a user
        yield user_model_1.default.create(newUser);
        //Perform POST with the same user
        const res = yield (0, supertest_1.default)(index_1.app).post("/api/user").send(newUser);
        //Assertion
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User already exists");
    }));
});
