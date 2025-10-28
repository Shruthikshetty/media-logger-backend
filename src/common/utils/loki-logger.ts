/**
 * @file contains a function that sends logs to loki
 */
import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from './logger';

// define types
type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogMessage = string | Record<string, any>;
type LogLabels = Record<string, string>;

//config env
dotenv.config();

// get the loki config variables from the .env file
const lokiUrl = process.env.LOKI_HOST ?? '';
const lokiUser = process.env.LOKI_USERNAME ?? '';
const lokiPassword = process.env.LOKI_API_KEY ?? '';

export async function lokiLog(
  level: LogLevel,
  msg: LogMessage,
  labels: LogLabels = {}
) {
  if (!lokiUrl || !lokiUser || !lokiPassword) {
    logger.error('LOKI_HOST, LOKI_USERNAME, LOKI_API_KEY not set');
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
    await axios.post(
      `${lokiUrl}/loki/api/v1/push`,
      { streams: [stream] },
      {
        headers: { 'Content-Type': 'application/json' },
        auth: { username: lokiUser, password: lokiPassword },
        timeout: 5000,
      }
    );
  } catch (error) {
    logger.error('Error sending log to Loki', error);
  }
}
