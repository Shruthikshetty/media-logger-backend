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
const mongoose_1 = __importDefault(require('mongoose'));
const mongodb_memory_server_1 = require('mongodb-memory-server');
const index_1 = require('../index');
const user_model_1 = __importDefault(require('../models/user.model'));
const mock_data_1 = require('../__mocks__/mock-data');
describe('Auth API E2E: POST /api/auth/login', () => {
  let mongoServer;
  //Start the in-memory server and connect Mongoose
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
      yield mongoose_1.default.connect(mongoServer.getUri());
    })
  );
  //Disconnect and stop the server
  afterAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield mongoose_1.default.disconnect();
      yield mongoServer.stop();
    })
  );
  // Before each test, clear and re-seed the User collection
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield user_model_1.default.deleteMany({});
      yield user_model_1.default.create(mock_data_1.mockTestUsers);
    })
  );
  // Test : successful login
  it('should successfully log in a user with correct credentials and return a JWT token', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const loginPayload = {
        email: 'Admin@example.com', // From mockTestUsers
        password: 'password123', // From mockTestUsers
      };
      const res = yield (0, supertest_1.default)(index_1.app)
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
    }));
  // Test failure case: wrong password
  it('should return a 401 Unauthorized error for an incorrect password', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const loginPayload = {
        email: 'Admin@example.com',
        password: 'wrong-password', // Incorrect password
      };
      const res = yield (0, supertest_1.default)(index_1.app)
        .post('/api/auth/login')
        .send(loginPayload);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid password/i);
    }));
  // Test failure case: user not found
  it('should return a 404 Not Found error for an email that does not exist', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const loginPayload = {
        email: 'nonexistent-user@example.com', // This email is not in the DB
        password: 'password123',
      };
      const res = yield (0, supertest_1.default)(index_1.app)
        .post('/api/auth/login')
        .send(loginPayload);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/User not found/i);
    }));
  // Test failure case: validation error (from Zod)
  it('should return a 400 Bad Request error if validation fails (e.g., missing password)', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const loginPayload = {
        email: 'Admin@example.com', // Password field is missing
      };
      const res = yield (0, supertest_1.default)(index_1.app)
        .post('/api/auth/login')
        .send(loginPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch('Password must be string');
    }));
});
