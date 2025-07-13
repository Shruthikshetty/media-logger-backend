/**
 * this contains all user related controllers
 */

import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { handleError } from '../common/utils/handle-error';
import User from '../models/user.model';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import { AddUserZodSchemaType } from '../common/validation-schema/user/add-user';
import { omit } from 'lodash';
import { GET_ALL_USER_LIMITS } from '../common/constants/config.constants';
import {
  getValidatedLimit,
  getValidatedStart,
} from '../common/utils/pagination';

// controller to add a new user
export const addUser = async (
  req: ValidatedRequest<AddUserZodSchemaType>,
  res: Response
) => {
  try {
    // create a new user
    const newUser = new User(req.validatedData!);

    // save the user
    const saveUser = await newUser.save();

    // in case user is not saved
    if (!saveUser) {
      handleError(res, { message: 'User creation failed' });
      return;
    }

    // return the saved user
    res.status(201).json({
      success: true,
      data: saveUser,
      message: 'User created successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      message: isDuplicateKeyError(err)
        ? 'User already exists'
        : 'User creation failed',
      error: err,
    });
  }
};

//controller to get all users
export const getAllUsers = async (req: ValidatedRequest<{}>, res: Response) => {
  // get the limit and start from query params
  let { limit, start, page } = req.query;

  // validate the limit and start
  const validatedLimit = getValidatedLimit(
    limit as string,
    GET_ALL_USER_LIMITS.limits
  );

  let validatedStart: number;

  // in case page is provided
  if (page) {
    const pageNumber = Math.max(1, Number(page) || 1);
    validatedStart = (pageNumber - 1) * validatedLimit;
  } else {
    validatedStart = getValidatedStart(
      start as string,
      GET_ALL_USER_LIMITS.start.default
    );
  }

  try {
    // get all users from database with total count
    const [users, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 }) // recent first
        .limit(validatedLimit)
        .skip(validatedStart)
        .select('-password')
        .lean()
        .exec(),
      User.countDocuments(),
    ]);

    // calculate pagination metadata
    const currentPage = Math.floor(validatedStart / validatedLimit) + 1;
    const totalPages = Math.ceil(total / validatedLimit);

    // return the users
    res.status(200).json({
      success: true,
      data: {
        users,
        // pagination details
        pagination: {
          total,
          start: validatedStart,
          limit: validatedLimit,
          hasMore: validatedStart + validatedLimit < total,
          currentPage,
          totalPages,
          hasPrevious: validatedStart > 0,
          nextPage: currentPage < totalPages ? currentPage + 1 : null,
          previousPage: currentPage > 1 ? currentPage - 1 : null,
        },
      },
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to get the logged in user details
export const getUserDetail = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    // filter the data
    const userDetails = omit(req.userData, ['password', '__v']);
    // return the user details from validated user jwt
    res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
