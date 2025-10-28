"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("../utils/logger");
const loki_logger_1 = require("../utils/loki-logger");
const node_crypto_1 = require("node:crypto");
const sanitize_1 = require("../utils/sanitize");
/**
 * Express middleware to log all incoming HTTP requests.
 * Logs method, URL, IP address, and response status code.
 * The status codes are colord using chalk for better visibility
 *
 * This also logs both the request and response to loki
 * Attaches a unique id to the request and logs the request with the id and other information
 * Also logs the response with the same id and other information
 */
const requestLogger = (req, res, next) => {
    //----------------------- log to loki ---------------------
    try {
        // attach a unique id to the request
        const request = req;
        // generate a unique request id
        const requestId = (0, node_crypto_1.randomUUID)();
        request.id = requestId;
        res.setHeader('X-Request-Id', requestId);
        // log request
        (0, loki_logger_1.lokiLog)('info', {
            message: `Incoming request: ${req.method} ${req.originalUrl}`,
            requestId: request.id,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
        }, { direction: 'request' });
        // Keep a reference to the original res.send
        const originalSend = res.send;
        // Redefine res.send
        res.send = function (body) {
            const level = res.statusCode >= 500 ? 'error' : 'info';
            let parsedBody;
            let modifiedBody = body;
            try {
                // Safely attempt to parse JSON only if it's a non-empty string that looks like an object or array
                if (typeof body === 'string' &&
                    body.length > 0 &&
                    (body.trim().startsWith('{') || body.trim().startsWith('['))) {
                    parsedBody = JSON.parse(body);
                    // If the parsed body is an object, add the requestId
                    // as per the apps standard response its always expected to be a object
                    if (typeof parsedBody === 'object') {
                        parsedBody.requestId = requestId;
                        modifiedBody = JSON.stringify(parsedBody); // Re-stringify the modified object
                    }
                }
                else {
                    // If not JSON, use the body as-is (if string) or a placeholder
                    parsedBody =
                        typeof body === 'string' ? body : '[Non-string or empty body]';
                }
                // Log the response
                (0, loki_logger_1.lokiLog)(level, {
                    message: `Sending response for: ${req.method} ${req.originalUrl}`,
                    requestId: request === null || request === void 0 ? void 0 : request.id,
                    statusCode: res.statusCode,
                    body: (0, sanitize_1.sanitizeForLog)(parsedBody), // sanitize the body
                }, { direction: 'response' });
            }
            catch (error) {
                // ** If parsing or logging fails, log a warning instead of crashing **
                (0, loki_logger_1.lokiLog)('warn', {
                    message: 'Failed to parse or log response body. Logging raw content.',
                    requestId: request.id,
                    statusCode: res.statusCode,
                    error: error instanceof Error ? error.message : String(error),
                    rawBody: body, // Include the raw body for debugging purposes
                }, { direction: 'response' });
            }
            // Call the original res.send to actually send the response to the client
            return originalSend.call(res, modifiedBody);
        };
    }
    catch (error) {
        // Top-level catch block
        logger_1.logger.error('FATAL: Logging middleware encountered an unrecoverable error.', error);
    }
    //---------------------------------- in app logging -----------------------
    res.on('finish', () => {
        // extract status code
        const status = res.statusCode;
        // define color
        // eslint-disable-next-line no-unused-vars
        let statusColor;
        if (status >= 200 && status < 300) {
            // we show green for success message
            statusColor = chalk_1.default.green;
        }
        else if (status >= 400) {
            // we show red for failed messages
            statusColor = chalk_1.default.red;
        }
        else {
            // other 3XX codes are shown in yellow
            statusColor = chalk_1.default.yellow;
        }
        logger_1.logger.info(`${req.method} ${req.originalUrl} from ${req.ip} - ${statusColor(res.statusCode.toString())}`);
    });
    next();
};
exports.requestLogger = requestLogger;
