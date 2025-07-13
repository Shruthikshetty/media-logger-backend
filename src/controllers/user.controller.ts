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
//@TODO add pagination
export const getAllUsers = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    // get all users from database
    const users = await User.find({});

    // in case users are not found
    if (!users || users.length === 0) {
      handleError(res, { message: 'Users not found' });
      return;
    }

    // return the users
    res.status(200).json({
      success: true,
      data: users,
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
