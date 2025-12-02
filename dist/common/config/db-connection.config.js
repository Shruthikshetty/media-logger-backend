"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
/**
 * @file holds the db connection logic
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
// configure .env
dotenv_1.default.config();
const connectDB = async () => {
    try {
        // Check if there is already a connection
        if (mongoose_1.default.connection.readyState >= 1) {
            return;
        }
        await mongoose_1.default.connect(process.env.MONGO_URI ?? '');
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error('MongoDB connection error:', err.message);
        (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
        // Exit process with failure
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
    }
    catch (err) {
        console.error('Error disconnecting from MongoDB:', err.message);
        (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
