"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserLastLogin = updateUserLastLogin;
const user_model_1 = __importDefault(require("../../models/user.model"));
const logger_1 = require("./logger");
/**
 * Updates the last login date of a user in the database
 * @param {string} userId The id of the user to update
 */
async function updateUserLastLogin(userId) {
    await user_model_1.default.findByIdAndUpdate(userId, {
        lastLogin: new Date(),
    }).catch(() => {
        logger_1.logger.error('Error updating user last login : %s', userId);
    });
}
