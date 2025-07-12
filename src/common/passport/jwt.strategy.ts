/**
 * @file holds the passport middleware for jwt token based strategy
 */

import { PassportStatic } from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../../models/user.model';
import { JWT_SECRET_DEFAULT } from '../constants/config.constants';

// configure .env
dotenv.config();

// passport middleware for jwt
export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET ?? JWT_SECRET_DEFAULT,
      },
      async (jwtPayload, done) => {
        try {
          // find user by id
          const user = await User.findById(jwtPayload.id).lean().exec();
          if (!user) return done(null, false);
          // in no error return the user
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
