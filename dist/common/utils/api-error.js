'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ApiError = void 0;
/**
 * Custom error class for API errors. This class extends the base Error class
 * and adds a statusCode property, which is used to set the HTTP status code of
 * the response.
 */
class ApiError extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.ApiError = ApiError;
