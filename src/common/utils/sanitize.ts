import { redact } from '@visulima/redact';

// Define any custom rules or use the extensive defaults.
// The library automatically redacts common sensitive keys.
const customRules = ['myCustomSecretField'];

/**
 * Sanitizes an object for logging using @visulima/redact.
 * It redacts sensitive keys and truncates the output if it's too long.
 * @param data The input object or value to sanitize.
 * @param maxLogLength The maximum length for the stringified output.
 * @returns A sanitized version of the data.
 */
export function sanitizeForLog(data: unknown, maxLogLength = 10000): unknown {
  // Redact the data using the library
  const redactedData = redact(data, customRules);

  // Stringify and truncate if necessary
  const logString = JSON.stringify(redactedData);
  if (logString.length > maxLogLength) {
    return logString.substring(0, maxLogLength) + '...[truncated]';
  }

  // Return the redacted object itself, not the string
  return redactedData;
}
