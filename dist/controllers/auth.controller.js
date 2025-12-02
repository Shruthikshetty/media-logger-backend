"use strict";
/**
 * @file contains all the controllers related to authentication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_constants_1 = require("../common/constants/config.constants");
const hashing_1 = require("../common/utils/hashing");
const passport_1 = __importDefault(require("../common/passport"));
const lodash_1 = require("lodash");
const update_user_last_login_1 = require("../common/utils/update-user-last-login");
// controller to login
const login = async (req, res) => {
    // destructure request body
    const { email, password } = req.validatedData;
    try {
        //find the user by the email
        const user = await user_model_1.default.findOne({ email });
        //in case user is not found
        if (!user) {
            (0, handle_error_1.handleError)(res, {
                message: 'User not found verify email',
                statusCode: 404,
            });
            return;
        }
        // validate password
        const isValidPassword = await (0, hashing_1.decrypt)(password, user.password);
        if (!isValidPassword) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid password', statusCode: 401 });
            return;
        }
        // generate jwt token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.JWT_SECRET ?? config_constants_1.JWT_SECRET_DEFAULT, {
            expiresIn: config_constants_1.JWT_EXPIRES_IN,
        });
        //update user login time
        (0, update_user_last_login_1.updateUserLastLogin)(user._id);
        // if validation is successful pass token jwt
        res.status(200).json({
            success: true,
            data: { token, user: (0, lodash_1.omit)(user.toObject(), 'password') },
            message: 'Login successful',
        });
    }
    catch (err) {
        // handle unexpected  error
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.login = login;
//verify if the token is valid
const verifyToken = async (req, res) => {
    try {
        // verify token
        passport_1.default.authenticate('jwt', { session: false }, (err, user) => {
            // in case of error
            if (err) {
                (0, handle_error_1.handleError)(res, {
                    statusCode: 500,
                    message: 'Auth error , try again after some time',
                });
                return;
            }
            // in case token is not valid / expired
            if (!user) {
                (0, handle_error_1.handleError)(res, {
                    statusCode: 401,
                    message: 'Invalid token',
                });
                return;
            }
            // if token is valid
            res.status(200).json({
                success: true,
                message: 'Token is valid',
            });
        })(req, res);
    }
    catch (err) {
        // handle unexpected  error
        (0, handle_error_1.handleError)(res, { error: err });
    }
};
exports.verifyToken = verifyToken;
