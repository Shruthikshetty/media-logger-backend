/**
 * This contains the user model
 */
import { Schema, Document, model } from 'mongoose';
import { USER_ROLES } from '../common/constants/model.constants';
import { Regex } from '../common/constants/patterns.constants';
import { encrypt } from '../common/utils/hashing';

//types
export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  profileImg: string;
  role: string;
  xp: number;
  location: string;
  bio: string;
}

// schema
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: Regex.email,
      unique: true,
    },
    profileImg: {
      type: String,
      required: false,
      default: '',
    },
    role: {
      type: String,
      required: false,
      default: 'user',
      enum: USER_ROLES,
    },
    xp: {
      type: Number,
      required: false,
      default: 0,
    },
    location: {
      type: String,
      required: false,
      default: '',
    },
    bio: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook to hash the password if it is modified.
 */
UserSchema.pre<IUser>('save', async function (next) {
  // if not modified, skip
  if (!this.isModified('password')) return next();
  // else we hash the password
  const hashedPassword = await encrypt(this.password);
  this.password = hashedPassword;
  // call next once done
  next();
});

// create model from the schema and export
const User = model<IUser>('User', UserSchema);
export default User;
