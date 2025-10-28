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
    paths: config_constants_1.CUSTOM_SANITIZATION_RULES.map((rule) => `*.${rule}`), // Use wildcards to redact nested keys
    censor: '***Hidden***',
    serialize: false,
});
exports.redactor = redactor;
