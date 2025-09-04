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
const index_1 = require("../index");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const mock_data_1 = require("../__mocks__/mock-data");
const user_model_1 = __importDefault(require("../models/user.model"));
const supertest_2 = __importDefault(require("supertest"));
describe('POST /api/movie', () => {
    //initialize mongo server
    let mongoServer;
    let token;
    // Connect to a new in-memory database before running any tests.
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        //create users
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
    }));
    const loginUser = () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        const loginRes = yield (0, supertest_2.default)(index_1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        //get token
        token = loginRes.body.data.token;
    });
    // Remove and close the db and server.
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    describe('Add single movie POST /api/movie', () => {
        it('should create a new movie when given valid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const movieData = {
                title: 'Inception',
                directors: ['Christopher Nolan'],
                releaseYear: 2010,
                genre: ['Sci-Fi', 'Thriller'],
                description: 'E2E game ',
                runTime: 200,
                status: 'released',
                ageRating: 16,
                releaseDate: new Date().toISOString(),
            };
            //login user
            yield loginUser();
            //make api call
            const response = yield (0, supertest_1.default)(index_1.app)
                .post('/api/movie')
                .send(movieData)
                .set('Authorization', `Bearer ${token}`);
            // Check that the response body contains the created movie data
            expect(response.status).toBe(201);
            expect(response.body.data).toBeTruthy();
            expect(response.body.data.title).toBe(movieData.title);
            expect(response.body.data.directors[0]).toBe('Christopher Nolan');
        }));
        it('should return a 400 validation error if the title is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const movieData = {
                director: 'Christopher Nolan',
                releaseYear: 2010,
            };
            //login user
            yield loginUser();
            // make api call
            const response = yield (0, supertest_1.default)(index_1.app)
                .post('/api/movie')
                .send(movieData)
                .set('Authorization', `Bearer ${token}`);
            //assertions
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/Title is required/);
        }));
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_2.default)(index_1.app).post('/api/movie').send({});
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
    });
});
