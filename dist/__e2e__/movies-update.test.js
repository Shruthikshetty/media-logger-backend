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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mock_data_1 = require("../__mocks__/mock-data");
const user_model_1 = __importDefault(require("../models/user.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
describe('Movie update endpoints PATCH /api/movie/:id', () => {
    // Initialize mongo server
    let mongoServer;
    let token;
    let movieId1;
    let movieId2;
    // Create in memory mongo instance
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        // Create users
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
        // Create movies
        const movies = yield movie_model_1.default.insertMany(mock_data_1.mockTestMovies);
        movieId1 = movies[0]._id.toString();
        movieId2 = movies[1]._id.toString();
    }));
    // Clean up mongo
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    const loginUser = () => __awaiter(void 0, void 0, void 0, function* () {
        // Log in as admin
        const loginRes = yield (0, supertest_1.default)(__1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        // Get token
        token = loginRes.body.data.token;
    });
    describe('Successful movie updates', () => {
        it('should update a movie with all valid fields', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const updateData = {
                title: 'Updated Movie Title',
                description: 'Updated comprehensive description for the movie',
                averageRating: 8.5,
                cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
                directors: ['Christopher Nolan'],
                runTime: 148,
                languages: ['english', 'french'],
                posterUrl: 'https://example.com/updated-poster.jpg',
                backdropUrl: 'https://example.com/updated-backdrop.jpg',
                isActive: true,
                status: 'released',
                tags: ['Cult Classic', 'Award-winning'],
                ageRating: 13,
                trailerYoutubeUrl: 'https://youtube.com/watch?v=updated-trailer',
                releaseDate: new Date('2023-07-21').toISOString(),
            };
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);
            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Movie updated successfully');
            expect(res.body.data.title).toBe(updateData.title);
            expect(res.body.data.description).toBe(updateData.description);
            expect(res.body.data.averageRating).toBe(updateData.averageRating);
            expect(res.body.data.cast).toEqual(updateData.cast);
            expect(res.body.data.directors).toEqual(updateData.directors);
            expect(res.body.data.runTime).toBe(updateData.runTime);
            expect(res.body.data.languages).toEqual(updateData.languages);
            expect(res.body.data.ageRating).toBe(updateData.ageRating);
            expect(res.body.data.isActive).toBe(updateData.isActive);
            expect(res.body.data.status).toBe(updateData.status);
        }));
        it('should update movie with partial data (only title)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId2}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                title: 'Partially Updated Title',
            });
            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('Partially Updated Title');
        }));
    });
    describe('Validation error tests', () => {
        it('should return 400 when no fields are provided for update', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({});
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/At least one field must be updated/);
        }));
        it('should return 400 for invalid average rating (above 10)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                averageRating: 11.5,
            });
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Average rating can be at most 10/);
        }));
        it('should return 400 for invalid status value', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                status: 'invalid-status',
            });
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Status must be one of the following/);
        }));
        it('should return 400 for invalid tags', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                tags: ['InvalidTag', 'AnotherInvalidTag'],
            });
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Tags must be one of the following/);
        }));
        it('should return 400 for invalid release date format', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                releaseDate: 'invalid-date',
            });
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Release date must be a valid ISO 8601 string/);
        }));
    });
    describe('Authentication and authorization tests', () => {
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app).patch(`/api/movie/${movieId1}`).send({
                title: 'Updated title without auth',
            });
            // Assertions
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
        it('should return 401 for invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', 'Bearer invalid-token')
                .send({
                title: 'Updated title with invalid token',
            });
            // Assertions
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
    });
    describe('Resource not found tests', () => {
        it('should return 404 for non-existent movie ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${new mongoose_1.default.Types.ObjectId()}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                title: 'Updated title for non-existent movie',
            });
            // Assertions
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Movie does not exist/);
        }));
        it('should return 400 for invalid movie ID format', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/invalid-id`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                title: 'Updated title with invalid id',
            });
            // Assertions
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid movie id/);
        }));
    });
    describe('Edge cases and data transformation', () => {
        it('should transform languages to lowercase', () => __awaiter(void 0, void 0, void 0, function* () {
            // Log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .patch(`/api/movie/${movieId1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                languages: ['ENGLISH', 'HINDI', 'SPANISH'],
            });
            // Assertions
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.languages).toEqual(['english', 'hindi', 'spanish']);
        }));
    });
});
