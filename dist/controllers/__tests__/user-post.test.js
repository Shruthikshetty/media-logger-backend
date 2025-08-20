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
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../user.controller");
const mockResponse = {
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
const mockSave = jest.fn().mockResolvedValue(Object.assign(Object.assign({}, mockUserData), { toObject: jest.fn().mockReturnValue(mockUserData) }));
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
    const mockRequest = {
        validatedData: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'SecurePass123!',
            bio: 'Software Engineer',
            profileImg: 'https://example.com/avatar.jpg',
            xp: 0,
        },
    };
    it('should return 201 when user is added', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_controller_1.addUser)(mockRequest, mockResponse);
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
    }));
    it('should return 409 when user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        // set duplicate key error true
        mockSave.mockRejectedValueOnce({ code: 11000 });
        mockIsDuplicateKeyError = true;
        yield (0, user_controller_1.addUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(409);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'User already exists',
        });
        // reset
        mockIsDuplicateKeyError = false;
    }));
    it('should return 500 when an unknown error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        // set save to throw error
        mockSave.mockRejectedValueOnce({});
        yield (0, user_controller_1.addUser)(mockRequest, mockResponse);
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
    }));
});
