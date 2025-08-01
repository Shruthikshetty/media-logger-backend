"use strict";
/**
 * this contains all user related controllers
 */
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
exports.updateRoleById = exports.updateUser = exports.deleteUserById = exports.deleteUser = exports.getUserDetail = exports.getAllUsers = exports.addUser = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const user_model_1 = __importDefault(require("../models/user.model"));
const mongo_errors_1 = require("../common/utils/mongo-errors");
const lodash_1 = require("lodash");
const config_constants_1 = require("../common/constants/config.constants");
const pagination_1 = require("../common/utils/pagination");
const delete_user_1 = require("../common/validation-schema/user/delete-user");
const hashing_1 = require("../common/utils/hashing");
const mongoose_1 = __importDefault(require("mongoose"));
// controller to add a new user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create a new user
        const newUser = new user_model_1.default(req.validatedData);
        // save the user
        const saveUser = yield newUser.save();
        // in case user is not saved
        if (!saveUser) {
            (0, handle_error_1.handleError)(res, { message: 'User creation failed' });
            return;
        }
        // return the saved user
        res.status(201).json({
            success: true,
            data: saveUser,
            message: 'User created successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            message: (0, mongo_errors_1.isDuplicateKeyError)(err)
                ? 'User already exists'
                : 'User creation failed',
            error: err,
            statusCode: (0, mongo_errors_1.isDuplicateKeyError)(err) ? 409 : 500,
        });
    }
});
exports.addUser = addUser;
//controller to get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get pagination params
    const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_USER_LIMITS);
    try {
        // get all users from database with total count
        const [users, total] = yield Promise.all([
            user_model_1.default.find()
                .sort({ createdAt: -1 }) // recent first
                .limit(limit)
                .skip(start)
                .select('-password')
                .lean()
                .exec(),
            user_model_1.default.countDocuments(),
        ]);
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // return the users
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination,
            },
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getAllUsers = getAllUsers;
//controller to get the logged in user details
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // filter the data
        const userDetails = (0, lodash_1.omit)(req.userData, ['password', '__v']);
        // return the user details from validated user jwt
        res.status(200).json({
            success: true,
            data: userDetails,
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.getUserDetail = getUserDetail;
//controller to delete the logged in user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //delete the user
        const deletedUser = yield user_model_1.default.findByIdAndDelete(req.userData._id)
            .select('-password')
            .lean()
            .exec();
        // in case user is not deleted
        if (!deletedUser) {
            (0, handle_error_1.handleError)(res, { message: 'User deletion failed' });
            return;
        }
        // return the deleted user
        res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'User deleted successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.deleteUser = deleteUser;
//controller to delete user by id
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get id from params
        const { id } = req.params;
        // validate if
        const isValidId = delete_user_1.DeleteUserZodSchema.safeParse({ id }).success;
        if (!isValidId) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid user id', statusCode: 400 });
            return;
        }
        //delete the user
        const deletedUser = yield user_model_1.default.findByIdAndDelete(id)
            .select('-password')
            .lean()
            .exec();
        // in case user is not deleted
        if (!deletedUser) {
            (0, handle_error_1.handleError)(res, { message: 'User not found', statusCode: 404 });
            return;
        }
        // return the deleted user
        res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'User deleted successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.deleteUserById = deleteUserById;
//controller to update the logged in user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let password;
        // hash password if present
        if ((_a = req.validatedData) === null || _a === void 0 ? void 0 : _a.password) {
            password = yield (0, hashing_1.encrypt)(req.validatedData.password);
        }
        // handle unexpected error
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.userData._id, Object.assign(Object.assign({}, req.validatedData), (password && { password })), {
            new: true,
        })
            .select('-password -__v')
            .lean()
            .exec();
        // if not updated user
        if (!updatedUser) {
            (0, handle_error_1.handleError)(res, { message: 'User update failed' });
            return;
        }
        // send response
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'User updated successfully',
        });
    }
    catch (err) {
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.updateUser = updateUser;
//controller to update role by id
const updateRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get id from params
        const { id } = req.params;
        //incase invalid id
        if (!mongoose_1.default.isValidObjectId(id)) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid user id', statusCode: 400 });
            return;
        }
        // get new role from validated data
        const { role } = req.validatedData;
        // update the role
        const updatedRole = yield user_model_1.default.findByIdAndUpdate(id, { role }, {
            new: true,
        })
            .select('-password -__v')
            .lean()
            .exec();
        // in case role is not updated
        if (!updatedRole) {
            (0, handle_error_1.handleError)(res, { message: 'User not found', statusCode: 404 });
            return;
        }
        //send response
        res.status(200).json({
            success: true,
            data: updatedRole,
            message: 'User role updated successfully',
        });
    }
    catch (err) {
        // handle unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
});
exports.updateRoleById = updateRoleById;
