import { Types } from 'mongoose';
import User from '../../models/user.model';
import { logger } from './logger';

/**
 * Updates the last login date of a user in the database
 * @param {string} userId The id of the user to update
 */
export async function updateUserLastLogin(userId: string | Types.ObjectId) {
  await User.findByIdAndUpdate(userId, {
    lastLogin: new Date(),
  }).catch(() => {
    logger.error('Error updating user last login : %s', userId);
  });
}
