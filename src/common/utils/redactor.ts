import fastRedact from 'fast-redact';
import { CUSTOM_SANITIZATION_RULES } from '../constants/config.constants';

/**
 * Creates and configures a fast-redact instance.
 * This is synchronous
 */
const redactor = fastRedact({
  paths: CUSTOM_SANITIZATION_RULES.map((rule) => `*.${rule}`), // Use wildcards to redact nested keys
  censor: '***Hidden***',
  serialize: false,
});

export { redactor };
