"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeForLog = sanitizeForLog;
const redactor_1 = require("./redactor");
const lodash_1 = require("lodash");
/**
 * Sanitizes an object for logging using fast-redact.
 * It redacts sensitive keys
 * @param data The input object or value to sanitize.
 * @returns A sanitized version of the data object or value if it is not an object.
 */
function sanitizeForLog(data) {
    // fast-redact only works on objects.
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    // Clone the object to avoid mutating the original
    const dataToRedact = (0, lodash_1.cloneDeep)(data);
    // The redactor function mutates the object, so we pass a clone to be safe.
    const sanitizedOutput = (0, redactor_1.redactor)(dataToRedact);
    return sanitizedOutput;
}
