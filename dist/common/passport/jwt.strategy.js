"use strict";
/**
 * @file holds the passport middleware for jwt token based strategy
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const config_constants_1 = require("../constants/config.constants");
// configure .env
dotenv_1.default.config();
// passport middleware for jwt
exports.default = (passport) => {
    passport.use(new passport_jwt_1.Strategy({
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET ?? config_constants_1.JWT_SECRET_DEFAULT,
    }, async (jwtPayload, done) => {
        try {
            // find user by id
            const user = await user_model_1.default.findById(jwtPayload.id).lean().exec();
            if (!user)
                return done(null, false);
            // in no error return the user
            return done(null, user);
        }
        catch (err) {
            return done(err, false);
        }
    }));
};
