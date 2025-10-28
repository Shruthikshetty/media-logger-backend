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
var _a, _b, _c;
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
const lokiUrl = (_a = process.env.LOKI_HOST) !== null && _a !== void 0 ? _a : '';
const lokiUser = (_b = process.env.LOKI_USERNAME) !== null && _b !== void 0 ? _b : '';
const lokiPassword = (_c = process.env.LOKI_API_KEY) !== null && _c !== void 0 ? _c : '';
function lokiLog(level_1, msg_1) {
    return __awaiter(this, arguments, void 0, function* (level, msg, labels = {}) {
        if (!lokiUrl || !lokiUser || !lokiPassword) {
            logger_1.logger.error('LOKI_HOST, LOKI_USERNAME, LOKI_API_KEY not set');
            return;
        }
        const ns = BigInt(Date.now()) * BigInt(1000000); // high-precision timestamp in nanoseconds
        const stream = {
            stream: Object.assign({ app: 'media-logger-backend', level }, labels),
            values: [
                [ns.toString(), typeof msg === 'string' ? msg : JSON.stringify(msg)],
            ],
        };
        try {
            yield axios_1.default.post(`${lokiUrl}/loki/api/v1/push`, { streams: [stream] }, {
                headers: { 'Content-Type': 'application/json' },
                auth: { username: lokiUser, password: lokiPassword },
                timeout: 5000,
            });
        }
        catch (error) {
            logger_1.logger.error('Error sending log to Loki: %s', error);
        }
    });
}
