/**
 * Custom error class for API errors. This class extends the base Error class
 * and adds a statusCode property, which is used to set the HTTP status code of
 * the response.
 */
export class ApiError extends Error {
  statusCode?: number;
  stack?: string;

  constructor(statusCode: number = 500, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
