/**
 * this contains all user related controllers
 */

import { Response } from 'express';
import { ValidatedRequest } from '../types/custom-types';
import { handleError } from '../common/utils/handle-error';
import User from '../models/user.model';
import { isDuplicateKeyError } from '../common/utils/mongo-errors';
import { AddUserZodSchemaType } from '../common/validation-schema/user/add-user';

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
