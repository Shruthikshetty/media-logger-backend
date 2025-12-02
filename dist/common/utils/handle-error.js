"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const logger_1 = require("./logger");
/**
 * Standard messages for common HTTP status codes.
 */
const statusMessages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Server down please try after some time',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout: Upstream service did not respond in time',
    // and additional status to be added
};
/**
 * Centralized error response handler.
 * @param res - Express Response object
 * @param options - Error response options
 */
const handleError = (res, options) => {
    // by default status code will be 500
    const statusCode = options?.statusCode ?? 500;
    // set default message configured above
    const message = options?.message ?? statusMessages[statusCode];
    //logger for dev mode
    if (process.env.NODE_ENV === 'development' && options?.error) {
        logger_1.logger.error(JSON.stringify(options?.error, null, 2));
    }
    // handle error response
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.handleError = handleError;
