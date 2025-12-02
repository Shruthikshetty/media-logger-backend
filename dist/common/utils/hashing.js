"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_constants_1 = require("../constants/config.constants");
/**
 * Hashes a plain text string (usually a password)
 * @param plainText The string to hash
 */
const encrypt = async (plainText) => {
    const salt = await bcrypt_1.default.genSalt(config_constants_1.SALT_ROUNDS);
    return await bcrypt_1.default.hash(plainText, salt);
};
exports.encrypt = encrypt;
/**
 * Compares a plain text string with a hashed string
 * @param plainText The original plain string
 * @param hashedText The previously hashed string
 */
const decrypt = async (plainText, hashedText) => {
    return await bcrypt_1.default.compare(plainText, hashedText);
};
exports.decrypt = decrypt;
