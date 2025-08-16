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
const mongodb_memory_server_1 = require('mongodb-memory-server');
const mongoose_1 = __importDefault(require('mongoose'));
const mock_data_1 = require('../__mocks__/mock-data');
const user_model_1 = __importDefault(require('../models/user.model'));
const movie_model_1 = __importDefault(require('../models/movie.model'));
const supertest_1 = __importDefault(require('supertest'));
const __1 = require('..');
describe('movies delete related endpoints', () => {
  //initialize mongo server
  let mongoServer;
  let token;
  let movieId1;
  let movieId2;
  let movieId3;
  // Connect to a new in-memory database before running any tests.
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
      yield mongoose_1.default.connect(mongoServer.getUri());
      //create users
      yield user_model_1.default.create(mock_data_1.mockTestUsers);
      // create movies mock data
      const movies = yield movie_model_1.default.insertMany(
        mock_data_1.mockTestMovies
      );
      movieId1 = movies[0]._id.toString();
      movieId2 = movies[1]._id.toString();
      movieId3 = movies[2]._id.toString();
    })
  );
  const loginUser = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      //log in as admin
      const loginRes = yield (0, supertest_1.default)(__1.app)
        .post('/api/auth/login')
        .send({ email: 'Admin@example.com', password: 'password123' });
      //get token
      token = loginRes.body.data.token;
    });
  // Remove and close the db and server.
  afterAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield mongoose_1.default.disconnect();
      yield mongoServer.stop();
    })
  );
  describe('single delete using id DELETE /api/movie/:id', () => {
    it('should allow an admin to delete a movie', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        yield loginUser();
        // delete the first movie
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/${movieId1}`)
          .set('Authorization', `Bearer ${token}`);
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(mock_data_1.mockTestMovies[0].title);
      }));
    it('should reject deletion when unauthenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).delete(
          `/api/movie/${movieId1}`
        );
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
      }));
    it('should return 404 if movie not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/${new mongoose_1.default.Types.ObjectId()}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/does not exist/i);
      }));
    it('should return 400 if invalid movie id', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/invalid-id`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch('Invalid movie id');
      }));
  });
  describe('bulk delete using ids DELETE /api/movie/bulk', () => {
    it('should allow an admin to delete multiple movies', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        yield loginUser();
        // delete the first movie
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/bulk`)
          .set('Authorization', `Bearer ${token}`)
          .send({ movieIds: [movieId2] });
        //assertions
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.deletedCount).toBe(1);
      }));
    it('should reject bulk deletion when unauthenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(__1.app).delete(
          `/api/movie/bulk`
        );
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Unauthorized/);
      }));
    it('should return 400 if invalid movie id', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/bulk`)
          .set('Authorization', `Bearer ${token}`)
          .send({ movieIds: ['invalid-id'] });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch('Invalid movie id');
      }));
    it('should return 404 if movie not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/bulk`)
          .set('Authorization', `Bearer ${token}`)
          .send({ movieIds: [new mongoose_1.default.Types.ObjectId()] });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch('No movies found');
      }));
    it('it should return 200 in case of partial delete when one of the ids is not existing ', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        //log in as admin
        yield loginUser();
        const res = yield (0, supertest_1.default)(__1.app)
          .delete(`/api/movie/bulk`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            movieIds: [movieId3, new mongoose_1.default.Types.ObjectId()],
          });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.deletedCount).toBe(1);
        expect(res.body.message).toMatch(
          /Some movies could not be deleted \(IDs not found or already deleted\)/
        );
      }));
  });
});
