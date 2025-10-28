import { redactor } from './redactor';
import { cloneDeep } from 'lodash';
/**
 * Sanitizes an object for logging using fast-redact.
 * It redacts sensitive keys
 * @param data The input object or value to sanitize.
 * @returns A sanitized version of the data object or value if it is not an object.
 */
export function sanitizeForLog(data: unknown): unknown {
  // fast-redact only works on objects.
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  // Clone the object to avoid mutating the original
  const dataToRedact = cloneDeep(data);

  // The redactor function mutates the object, so we pass a clone to be safe.
  const sanitizedOutput = redactor(dataToRedact);

  return sanitizedOutput;
}
