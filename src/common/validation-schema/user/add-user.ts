/**
 * @file holds the add user validation schema and type
 */

import { Schema } from 'express-validator';
import { Regex } from '../../constants/patterns.constants';

// type 
export type AddUserValidationType = {
  name: string;
  password: string;
  email: string;
  bio: string;
  location: string;
  profileImg: string;
  xp: number;
};

//schema const for add user
export const AddUserValidationSchema: Schema = {
  name: {
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name is required',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: 'Name must be at least 3 and at most 50 characters long',
    },
  },
  password: {
    isString: {
      errorMessage: 'Password must be a string',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  email: {
    isString: {
      errorMessage: 'Email must be a string',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
    matches: {
      options: Regex.email,
      errorMessage: 'Email is not valid',
    },
  },
  bio: {
    isString: {
      errorMessage: 'Bio must be a string',
    },
    optional: true,
    default: {
      options: '',
    },
    isLength: {
      options: { max: 200 },
      errorMessage: 'Bio can be at most 200 characters long',
    },
  },
  location: {
    isString: {
      errorMessage: 'Location must be a string',
    },
    optional: true,
    default: {
      options: '',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage:
        'Location must be at least 3 and at most 50 characters long',
    },
  },
  profileImg:{
    isString: {
      errorMessage: 'Profile image must be a string',
    },
    optional: true,
    default: {
      options: '',
    },
  },
  xp:{
    isNumeric: {
      errorMessage: 'XP must be a number',
    },
    optional: true,
    default: {
      options: 0,
    },
  }
};
