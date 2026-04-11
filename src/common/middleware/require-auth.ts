import { Request, Response, NextFunction } from 'express';
import passport from '../passport/index';
import { ADMIN } from '../constants/config.constants';
import { IUser } from '../../models/user.model';
import { handleError } from '../utils/handle-error';

/**
 * Middleware to require authenticated user.
 * Pass "admin" to require admin-only access.
 */
export const requireAuth = (role: 'admin' | 'user' = 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: IUser) => {
        if (err || !user || (role === 'admin' && user.role !== ADMIN)) {
          handleError(res, {
            statusCode: 401,
            message:
              role === 'admin'
                ? 'Unauthorized admin login is required'
                : 'Unauthorized login is required',
          });
          return;
        }

        // Attach user to request
        // @ts-ignore
        req.userData = user;
        next();
      }
    )(req, res, next);
  };
};

/**Middleware to authenticate user if jwt token is present else silently return empty */
export const optionalAuth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (_err: any, user: IUser) => {
        if (user) {
          // Attach user to request
          // @ts-ignore
          req.userData = user;
        }
        next();
      }
    )(req, res, next);
  };
};
