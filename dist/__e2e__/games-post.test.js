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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const user_model_1 = __importDefault(require("../models/user.model"));
const mock_data_1 = require("../__mocks__/mock-data");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
describe('Game creation POST /api/game', () => {
    //initialize mongo server
    let mongoServer;
    let token;
    //crete in memory mongo instance
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        //create users
        yield user_model_1.default.create(mock_data_1.mockTestUsers);
    }));
    // clean up mongo
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    const loginUser = () => __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        const loginRes = yield (0, supertest_1.default)(__1.app)
            .post('/api/auth/login')
            .send({ email: 'Admin@example.com', password: 'password123' });
        //get token
        token = loginRes.body.data.token;
    });
    describe('Games add single game POST /api/game ', () => {
        it('should create a new game successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                title: 'New E2E Game',
                genre: ['Puzzle'],
                platform: 'Web',
                description: 'New E2E Game description',
                status: 'released',
                releaseDate: new Date().toISOString(),
                platforms: [],
            };
            //log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .post('/api/game')
                .send(payload)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(payload.title);
            expect(res.body.data.genre[0]).toBe('Puzzle');
        }));
        it('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            //log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .post('/api/game')
                .send({ title: '' })
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Title must be/);
        }));
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app).post('/api/game').send({});
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
    });
    describe('Games add bulk games POST /api/game/bulk', () => {
        it('should create multiple games successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            //log in as admin
            yield loginUser();
            // Construct the file path to your mock JSON data
            const filePath = path_1.default.join(__dirname, 'temp-games.json');
            (0, fs_1.writeFileSync)(filePath, JSON.stringify(mock_data_1.mockTestGamesSet2), 'utf-8');
            try {
                //call endpoint
                const res = yield (0, supertest_1.default)(__1.app)
                    .post('/api/game/bulk')
                    .attach('gameDataFile', filePath, 'temp-games.json')
                    .set('Authorization', `Bearer ${token}`);
                //assertions
                expect(res.status).toBe(201);
                expect(res.body.success).toBe(true);
                expect(res.body.data.length).toBe(5);
            }
            finally {
                //clean up
                (0, fs_1.unlinkSync)(filePath);
            }
        }));
        it('should throw 400 for invalid validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            //log in as admin
            yield loginUser();
            // Construct the file path to your mock JSON data
            const filePath = path_1.default.join(__dirname, 'temp-games.json');
            (0, fs_1.writeFileSync)(filePath, JSON.stringify(mock_data_1.invalidGames), 'utf-8');
            try {
                //call endpoint
                const res = yield (0, supertest_1.default)(__1.app)
                    .post('/api/game/bulk')
                    .attach('gameDataFile', filePath, 'temp-games.json')
                    .set('Authorization', `Bearer ${token}`);
                //assertions
                expect(res.status).toBe(400);
                expect(res.body.success).toBe(false);
                expect(res.body.message).toMatch(/Genre must be/);
            }
            finally {
                //clean up
                (0, fs_1.unlinkSync)(filePath);
            }
        }));
        it('should return 401 for unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app).post('/api/game/bulk').send({});
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Unauthorized/);
        }));
        it('should show No file uploaded. Please upload a JSON file', () => __awaiter(void 0, void 0, void 0, function* () {
            //log in as admin
            yield loginUser();
            const res = yield (0, supertest_1.default)(__1.app)
                .post('/api/game/bulk')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/No file uploaded. Please upload a JSON file/);
        }));
    });
});
