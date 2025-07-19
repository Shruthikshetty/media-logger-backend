import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

/**
 * Checks if a given error is a duplicate key error in MongoDB.
 *
 * @param error - The error to check.
 *
 * @returns {boolean} True if the error is a duplicate key error.
 */

export function isDuplicateKeyError(error: unknown): boolean {
  return (error as MongoServerError)?.errorResponse?.code === 11000;
}

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 * @returns {boolean} True if the string is a valid ObjectId, false otherwise.
 */
export const isMongoIdValid = (id: string): boolean =>
  mongoose.isValidObjectId(id);
