import { addUser } from '../user.controller';

const mockResponse: any = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// Define user data 
const mockUserData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'SecurePass123!',
  bio: 'Software Engineer',
  profileImg: 'https://example.com/avatar.jpg',
  xp: 0,
};

// mock save
const mockSave = jest.fn().mockResolvedValue({
  ...mockUserData, // Spread the data
  toObject: jest.fn().mockReturnValue(mockUserData), // Add the toObject method
});

//mock user model
jest.mock('../../models/user.model', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      save: mockSave,
    })),
  };
});

// mock is duplicate key error
let mockIsDuplicateKeyError = false;
jest.mock('../../common/utils/mongo-errors', () => ({
  isDuplicateKeyError: jest.fn(() => mockIsDuplicateKeyError),
}));

describe('Test suite for add user', () => {
  const mockRequest: any = {
    validatedData: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'SecurePass123!',
      bio: 'Software Engineer',
      profileImg: 'https://example.com/avatar.jpg',
      xp: 0,
    },
  };
  it('should return 201 when user is added', async () => {
    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'Software Engineer',
        profileImg: 'https://example.com/avatar.jpg',
        xp: 0,
      },
      message: 'User created successfully',
    });
  });

  it('should return 409 when user already exists', async () => {
    // set duplicate key error true
    mockSave.mockRejectedValueOnce({ code: 11000 });
    mockIsDuplicateKeyError = true;
    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists',
    });
    // reset
    mockIsDuplicateKeyError = false;
  });

  it('should return 500 when an unknown error occurs', async () => {
    // set save to throw error
    mockSave.mockRejectedValueOnce({});
    await addUser(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'User creation failed',
    });
    // reset
    mockSave.mockResolvedValueOnce({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'SecurePass123!',
      bio: 'Software Engineer',
      profileImg: 'https://example.com/avatar.jpg',
      xp: 0,
    });
  });
});
