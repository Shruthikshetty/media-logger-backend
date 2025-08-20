/**
 * @file contains all the controllers related to authentication
 */

import { handleError } from '../common/utils/handle-error';
import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { LoginZodSchemaType } from '../common/validation-schema/auth/login-user';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET_DEFAULT,
} from '../common/constants/config.constants';
import { decrypt } from '../common/utils/hashing';
import passport from '../common/passport';

// controller to login
export const login = async (
  req: ValidatedRequest<LoginZodSchemaType>,
  res: Response
) => {
  // destructure request body
  const { email, password } = req.validatedData!;
  try {
    //find the user by the email
    const user = await User.findOne({ email });

    //in case user is not found
    if (!user) {
      handleError(res, {
        message: 'User not found verify email',
        statusCode: 404,
      });
      return;
    }

    // validate password
    const isValidPassword = await decrypt(password, user.password);

    if (!isValidPassword) {
      handleError(res, { message: 'Invalid password', statusCode: 401 });
      return;
    }

    // generate jwt token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET ?? JWT_SECRET_DEFAULT,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // if validation is successful pass token jwt
    res.status(200).json({
      success: true,
      data: { token },
      message: 'Login successful',
    });
  } catch (err) {
    // handle unexpected  error
    handleError(res, { error: err });
  }
};

//verify if the token is valid
export const verifyToken = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    // verify token
    passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: IUser) => {
        // in case of error
        if (err) {
          handleError(res, {
            statusCode: 500,
            message: 'Auth error , try again after some time',
          });

          return;
        }
        // in case token is not valid / expired
        if (!user) {
          handleError(res, {
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
      }
    )(req, res);
  } catch (err) {
    // handle unexpected  error
    handleError(res, { error: err });
  }
};
