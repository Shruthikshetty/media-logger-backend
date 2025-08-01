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
  getPaginationParams,
  getPaginationResponse,
} from '../common/utils/pagination';
import { DeleteUserZodSchema } from '../common/validation-schema/user/delete-user';
import { UpdateUserZodSchemaType } from '../common/validation-schema/user/update-user';
import { encrypt } from '../common/utils/hashing';
import mongoose from 'mongoose';
import { UpdateRoleZodSchemaType } from '../common/validation-schema/user/update-role';

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
      statusCode: isDuplicateKeyError(err) ? 409 : 500,
    });
  }
};

//controller to get all users
export const getAllUsers = async (req: ValidatedRequest<{}>, res: Response) => {
  // get pagination params
  const { limit, start } = getPaginationParams(req.query, GET_ALL_USER_LIMITS);

  try {
    // get all users from database with total count
    const [users, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 }) // recent first
        .limit(limit)
        .skip(start)
        .select('-password')
        .lean()
        .exec(),
      User.countDocuments(),
    ]);

    // get pagination details
    const pagination = getPaginationResponse(total, limit, start);

    // return the users
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination,
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

//controller to delete the logged in user
export const deleteUser = async (req: ValidatedRequest<{}>, res: Response) => {
  try {
    //delete the user
    const deletedUser = await User.findByIdAndDelete(req.userData!._id)
      .select('-password')
      .lean()
      .exec();

    // in case user is not deleted
    if (!deletedUser) {
      handleError(res, { message: 'User deletion failed' });
      return;
    }

    // return the deleted user
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to delete user by id
export const deleteUserById = async (
  req: ValidatedRequest<{}>,
  res: Response
) => {
  try {
    //get id from params
    const { id } = req.params;

    // validate if
    const isValidId = DeleteUserZodSchema.safeParse({ id }).success;

    if (!isValidId) {
      handleError(res, { message: 'Invalid user id', statusCode: 400 });
      return;
    }

    //delete the user
    const deletedUser = await User.findByIdAndDelete(id)
      .select('-password')
      .lean()
      .exec();

    // in case user is not deleted
    if (!deletedUser) {
      handleError(res, { message: 'User not found' , statusCode: 404});
      return;
    }

    // return the deleted user
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};

//controller to update the logged in user
export const updateUser = async (
  req: ValidatedRequest<UpdateUserZodSchemaType>,
  res: Response
) => {
  try {
    let password: string | undefined;
    // hash password if present
    if (req.validatedData!?.password) {
      password = await encrypt(req.validatedData!.password);
    }
    // handle unexpected error
    const updatedUser = await User.findByIdAndUpdate(
      req.userData!._id,
      { ...req.validatedData!, ...(password && { password }) },
      {
        new: true,
      }
    )
      .select('-password -__v')
      .lean()
      .exec();

    // if not updated user
    if (!updatedUser) {
      handleError(res, { message: 'User update failed' });
      return;
    }

    // send response
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (err) {
    handleError(res, {
      error: err,
    });
  }
};

//controller to update role by id
export const updateRoleById = async (
  req: ValidatedRequest<UpdateRoleZodSchemaType>,
  res: Response
) => {
  try {
    //get id from params
    const { id } = req.params;

    //incase invalid id
    if (!mongoose.isValidObjectId(id)) {
      handleError(res, { message: 'Invalid user id', statusCode: 400 });
      return;
    }

    // get new role from validated data
    const { role } = req.validatedData!;

    // update the role
    const updatedRole = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
      }
    )
      .select('-password -__v')
      .lean()
      .exec();

    // in case role is not updated
    if (!updatedRole) {
      handleError(res, { message: 'User not found'  , statusCode: 404});
      return;
    }

    //send response
    res.status(200).json({
      success: true,
      data: updatedRole,
      message: 'User role updated successfully',
    });
  } catch (err) {
    // handle unexpected error
    handleError(res, {
      error: err,
    });
  }
};
