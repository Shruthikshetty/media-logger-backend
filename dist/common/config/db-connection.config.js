"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if there is already a connection
        if (mongoose_1.default.connection.readyState >= 1) {
            return;
        }
        yield mongoose_1.default.connect((_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : '');
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error('MongoDB connection error:', err.message);
        (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
        // Exit process with failure
        process.exit(1);
    }
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
    }
    catch (err) {
        console.error('Error disconnecting from MongoDB:', err.message);
        (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
        process.exit(1);
    }
});
exports.disconnectDB = disconnectDB;
