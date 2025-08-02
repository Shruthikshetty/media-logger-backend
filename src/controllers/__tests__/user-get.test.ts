import { getAllUsers } from '../user.controller';

const mockResponse: any = {
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
    it('should return 200 when all users are fetched', async () => {
      const mockRequest: any = {
        query: { limit: 10, start: 0 },
      };
      await getAllUsers(mockRequest, mockResponse);
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
    });
  });
});
