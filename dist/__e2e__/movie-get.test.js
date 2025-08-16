'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const __1 = require('..');
const mock_data_1 = require('../__mocks__/mock-data');
const mongoose_1 = __importDefault(require('mongoose'));
const mongodb_memory_server_1 = require('mongodb-memory-server');
const movie_model_1 = __importDefault(require('../models/movie.model'));
describe('Movie API Integration Tests GET /api/movie', () => {
  //initialize mongo server
  let mongoServer;
  let movieId;
  //crete in memory mongo instance
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      //connect to mongo
      yield mongoose_1.default.connect(mongoUri);
      // push the movies mock data to mongo
      const movies = yield movie_model_1.default.insertMany(
        mock_data_1.mockTestMovies
      );
      movieId = movies[0]._id.toString();
    })
  );
  //clean up mongo
  afterAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield mongoose_1.default.disconnect();
      yield mongoServer.stop();
    })
  );
  describe('get all movies GET /api/movie/all', () => {
    it('should return all movies ', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get('/api/movie');
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.movies.length).toBe(
          mock_data_1.mockTestMovies.length
        );
      }));
  });
  describe('get specific movie GET /api/movie/:id', () => {
    it('should return specific movie', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get(
          `/api/movie/${movieId}`
        );
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(mock_data_1.mockTestMovies[0].title);
      }));
    it('should return 404 if movie not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get(
          `/api/movie/${new mongoose_1.default.Types.ObjectId()}`
        );
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Movie not found/);
      }));
    it('should return 400 if invalid movie id', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).get(
          `/api/movie/invalid-id`
        );
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid movie id/);
      }));
  });
});
