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
Object.defineProperty(exports, '__esModule', { value: true });
const user_controller_1 = require('../user.controller');
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
//mock users
const mockUsers = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'SecurePass123!',
    bio: 'Software Engineer',
    profileImg: 'https://example.com/avatar.jpg',
    xp: 0,
  },
  {
    name: 'John Doe2',
    email: 'johndoe2@example.com',
    password: 'SecurePass123!',
    bio: 'Software Engineer',
    profileImg: 'https://example.com/avatar.jpg',
    xp: 0,
  },
];
// Mock the static methods on User
jest.mock('../../models/user.model', () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn(() => mockUsers),
    countDocuments: jest.fn().mockResolvedValue(100),
  },
}));
// mock is duplicate key error
let mockIsDuplicateKeyError = false;
jest.mock('../../common/utils/mongo-errors', () => ({
  isDuplicateKeyError: jest.fn(() => mockIsDuplicateKeyError),
}));
describe('Test suite for user get controllers', () => {
  describe('Test suite for get all users', () => {
    it('should return 200 when all users are fetched', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockRequest = {
          query: { limit: 10, start: 0 },
        };
        yield (0, user_controller_1.getAllUsers)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          success: true,
          data: {
            users: [
              {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'SecurePass123!',
                bio: 'Software Engineer',
                profileImg: 'https://example.com/avatar.jpg',
                xp: 0,
              },
              {
                name: 'John Doe2',
                email: 'johndoe2@example.com',
                password: 'SecurePass123!',
                bio: 'Software Engineer',
                profileImg: 'https://example.com/avatar.jpg',
                xp: 0,
              },
            ],
            pagination: {
              total: 100,
              limit: 10,
              start: 0,
              currentPage: 1,
              totalPages: 10,
              hasMore: true,
              hasPrevious: false,
              nextPage: 2,
              previousPage: null,
            },
          },
        });
      }));
  });
});
