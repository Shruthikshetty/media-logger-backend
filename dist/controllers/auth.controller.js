"use strict";
/**
 * @file contains all the controllers related to authentication
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
exports.verifyToken = exports.login = void 0;
const handle_error_1 = require("../common/utils/handle-error");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_constants_1 = require("../common/constants/config.constants");
const hashing_1 = require("../common/utils/hashing");
const passport_1 = __importDefault(require("../common/passport"));
const lodash_1 = require("lodash");
// controller to login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // destructure request body
    const { email, password } = req.validatedData;
    try {
        //find the user by the email
        const user = yield user_model_1.default.findOne({ email });
        //in case user is not found
        if (!user) {
            (0, handle_error_1.handleError)(res, {
                message: 'User not found verify email',
                statusCode: 404,
            });
            return;
        }
        // validate password
        const isValidPassword = yield (0, hashing_1.decrypt)(password, user.password);
        if (!isValidPassword) {
            (0, handle_error_1.handleError)(res, { message: 'Invalid password', statusCode: 401 });
            return;
        }
        // generate jwt token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : config_constants_1.JWT_SECRET_DEFAULT, {
            expiresIn: config_constants_1.JWT_EXPIRES_IN,
        });
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
});
exports.login = login;
//verify if the token is valid
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.verifyToken = verifyToken;
