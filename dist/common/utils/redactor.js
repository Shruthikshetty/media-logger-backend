"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactor = void 0;
const fast_redact_1 = __importDefault(require("fast-redact"));
const config_constants_1 = require("../constants/config.constants");
/**
 * Creates and configures a fast-redact instance.
 * This is synchronous
 */
const redactor = (0, fast_redact_1.default)({
    paths: [
        ...config_constants_1.CUSTOM_SANITIZATION_RULES, // For top-level keys: ['password', 'token']
        ...config_constants_1.CUSTOM_SANITIZATION_RULES.map((rule) => `*.${rule}`), // For keys one level deep: ['*.password', '*.token']
        ...config_constants_1.CUSTOM_SANITIZATION_RULES.map((rule) => `*.*.${rule}`), // For keys two levels deep: ['*.*.password', '*.*.token']
        ...config_constants_1.CUSTOM_SANITIZATION_RULES.map((rule) => `*[*].${rule}`), // For keys inside an array of objects
    ],
    censor: '***Hidden***',
    serialize: false,
});
exports.redactor = redactor;
