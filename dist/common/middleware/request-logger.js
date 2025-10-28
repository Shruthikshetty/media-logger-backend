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
const parser_1 = require("../utils/parser");
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
            body: (0, sanitize_1.sanitizeForLog)(req.body),
        }, { direction: 'request' });
        // Keep a reference to the original res.send
        const originalSend = res.send;
        // Redefine res.send
        res.send = function (body) {
            // define the level of the log
            const level = res.statusCode >= 500 ? 'error' : 'info';
            // safely parse the body
            let bodyToSendToClient = (0, parser_1.parseSafely)(body);
            // We only modify the response if it's an object.
            if (typeof bodyToSendToClient === 'object' &&
                bodyToSendToClient !== null &&
                !Array.isArray(bodyToSendToClient) &&
                !Buffer.isBuffer(bodyToSendToClient)) {
                // Add the requestId to the object that will be sent to the client.
                bodyToSendToClient = Object.assign(Object.assign({}, bodyToSendToClient), { requestId });
                // stringify the body
                bodyToSendToClient = JSON.stringify(bodyToSendToClient);
            }
            try {
                // Log the response
                (0, loki_logger_1.lokiLog)(level, {
                    message: `Sending response for: ${req.method} ${req.originalUrl}`,
                    requestId: request === null || request === void 0 ? void 0 : request.id,
                    statusCode: res.statusCode,
                    body: (0, sanitize_1.sanitizeForLog)((0, parser_1.parseSafely)(bodyToSendToClient)), // sanitize the body
                }, { direction: 'response' });
            }
            catch (error) {
                // ** If parsing or logging fails, log a warning instead of crashing **
                (0, loki_logger_1.lokiLog)('warn', {
                    message: 'Failed to parse or log response body.',
                    requestId: request.id,
                    statusCode: res.statusCode,
                    error: error instanceof Error ? error.message : String(error),
                }, { direction: 'response' });
            }
            // Call the original res.send to actually send the response to the client
            return originalSend.call(res, bodyToSendToClient);
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
