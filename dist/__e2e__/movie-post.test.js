"use strict";
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
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
        //create users
        await user_model_1.default.create(mock_data_1.mockTestUsers);
    });
    const loginUser = async () => {
        //log in as admin
        const loginRes = await (0, supertest_2.default)(index_1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        //get token
        token = loginRes.body.data.token;
    };
    // Remove and close the db and server.
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    describe('Add single movie POST /api/movie', () => {
        it('should create a new movie when given valid data', async () => {
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
            await loginUser();
            //make api call
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/movie')
                .send(movieData)
                .set('Authorization', `Bearer ${token}`);
            // Check that the response body contains the created movie data
            expect(response.status).toBe(201);
            expect(response.body.data).toBeTruthy();
            expect(response.body.data.title).toBe(movieData.title);
            expect(response.body.data.directors[0]).toBe('Christopher Nolan');
        });
        it('should return a 400 validation error if the title is missing', async () => {
            const movieData = {
                director: 'Christopher Nolan',
                releaseYear: 2010,
            };
            //login user
            await loginUser();
            // make api call
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/movie')
                .send(movieData)
                .set('Authorization', `Bearer ${token}`);
            //assertions
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/Title is required/);
        });
        it('should return 401 for unauthenticated user', async () => {
            const res = await (0, supertest_2.default)(index_1.app).post('/api/movie').send({});
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        });
    });
});
