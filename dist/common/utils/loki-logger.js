"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lokiLog = lokiLog;
/**
 * @file contains a function that sends logs to loki
 */
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger");
//config env
dotenv_1.default.config();
// get the loki config variables from the .env file
const lokiUrl = process.env.LOKI_HOST ?? '';
const lokiUser = process.env.LOKI_USERNAME ?? '';
const lokiPassword = process.env.LOKI_API_KEY ?? '';
async function lokiLog(level, msg, labels = {}) {
    if (!lokiUrl || !lokiUser || !lokiPassword) {
        logger_1.logger.error('LOKI_HOST, LOKI_USERNAME, LOKI_API_KEY not set');
        return;
    }
    const ns = BigInt(Date.now()) * BigInt(1000000); // high-precision timestamp in nanoseconds
    const stream = {
        stream: { app: 'media-logger-backend', level, ...labels },
        values: [
            [ns.toString(), typeof msg === 'string' ? msg : JSON.stringify(msg)],
        ],
    };
    try {
        await axios_1.default.post(`${lokiUrl}/loki/api/v1/push`, { streams: [stream] }, {
            headers: { 'Content-Type': 'application/json' },
            auth: { username: lokiUser, password: lokiPassword },
            timeout: 5000,
        });
    }
    catch (error) {
        logger_1.logger.error('Error sending log to Loki', error);
    }
}
