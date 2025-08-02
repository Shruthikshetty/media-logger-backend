/**
 * @file holds the db connection logic
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { devLogger } from '../utils/logger';

// configure .env
dotenv.config();

const connectDB = async () => {
  try {
    // Check if there is already a connection
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URI ?? '');
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    devLogger(JSON.stringify(err, null, 2));
    // Exit process with failure
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (err: any) {
    console.error('Error disconnecting from MongoDB:', err.message);
    devLogger(JSON.stringify(err, null, 2));
    process.exit(1);
  }
};

export { connectDB, disconnectDB };
