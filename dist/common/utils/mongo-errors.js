'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.isMongoIdValid = void 0;
exports.isDuplicateKeyError = isDuplicateKeyError;
const mongoose_1 = __importDefault(require('mongoose'));
/**
 * Checks if a given error is a duplicate key error in MongoDB.
 *
 * @param error - The error to check.
 *
 * @returns {boolean} True if the error is a duplicate key error.
 */
function isDuplicateKeyError(error) {
  var _a;
  return (
    ((_a =
      error === null || error === void 0 ? void 0 : error.errorResponse) ===
      null || _a === void 0
      ? void 0
      : _a.code) === 11000
  );
}
/**
 * Checks if a given string is a valid MongoDB ObjectId.
 * @returns {boolean} True if the string is a valid ObjectId, false otherwise.
 */
const isMongoIdValid = (id) => mongoose_1.default.isValidObjectId(id);
exports.isMongoIdValid = isMongoIdValid;
