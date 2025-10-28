import fastRedact from 'fast-redact';
import { CUSTOM_SANITIZATION_RULES } from '../constants/config.constants';

/**
 * Creates and configures a fast-redact instance.
 * This is synchronous
 */
const redactor = fastRedact({
  paths: [
    ...CUSTOM_SANITIZATION_RULES, // For top-level keys: ['password', 'token']
    ...CUSTOM_SANITIZATION_RULES.map((rule) => `*.${rule}`), // For keys one level deep: ['*.password', '*.token']
    ...CUSTOM_SANITIZATION_RULES.map((rule) => `*.*.${rule}`), // For keys two levels deep: ['*.*.password', '*.*.token']
    ...CUSTOM_SANITIZATION_RULES.map((rule) => `*[*].${rule}`), // For keys inside an array of objects
  ],
  censor: '***Hidden***',
  serialize: false,
});

export { redactor };
