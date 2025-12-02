"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSafely = parseSafely;
/**
 * Safely parses a body, which could be a JSON string, an object, or something else.
 * @param body The input body to parse.
 * @returns A parsed object, the original input if not JSON, or a placeholder string.
 */
function parseSafely(body) {
    if (body === null || body === undefined) {
        return '[Empty Body]';
    }
    // If it's already an object (like req.body), return it.
    if (typeof body === 'object') {
        return body;
    }
    // If it's a string, try to parse it as JSON.
    if (typeof body === 'string') {
        try {
            // Check if it looks like a JSON object or array before parsing
            if (body.trim().startsWith('{') || body.trim().startsWith('[')) {
                return JSON.parse(body);
            }
        }
        catch {
            // If parsing fails, it's just a plain string.
            return body;
        }
    }
    // Fallback for other types (numbers, booleans, etc.)
    return String(body);
}
