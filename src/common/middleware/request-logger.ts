import chalk from 'chalk';
import { logger } from '../utils/logger';
import { Request, NextFunction, Response } from 'express';
import { lokiLog } from '../utils/loki-logger';
import { randomUUID } from 'node:crypto';
import { sanitizeForLog } from '../utils/sanitize';
import { parseSafely } from '../utils/parser';

/**
 * Express middleware to log all incoming HTTP requests.
 * Logs method, URL, IP address, and response status code.
 * The status codes are colord using chalk for better visibility
 *
 * This also logs both the request and response to loki
 * Attaches a unique id to the request and logs the request with the id and other information
 * Also logs the response with the same id and other information
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //----------------------- log to loki ---------------------
  try {
    // attach a unique id to the request
    const request = req as Request & { id: string };
    // generate a unique request id
    const requestId = randomUUID();
    request.id = requestId;
    res.setHeader('X-Request-Id', requestId);

    // log request
    lokiLog(
      'info',
      {
        message: `Incoming request: ${req.method} ${req.originalUrl}`,
        requestId: request.id,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        body: sanitizeForLog(req.body),
      },
      { direction: 'request' }
    );

    // Keep a reference to the original res.send
    const originalSend = res.send;
    // Redefine res.send
    res.send = function (body) {
      // define the level of the log
      const level = res.statusCode >= 500 ? 'error' : 'info';
      // safely parse the body
      let bodyToSendToClient = parseSafely(body);

      // We only modify the response if it's an object.
      if (
        typeof bodyToSendToClient === 'object' &&
        bodyToSendToClient !== null
      ) {
        // Add the requestId to the object that will be sent to the client.
        bodyToSendToClient.requestId = requestId;

        // stringify the body
        bodyToSendToClient = JSON.stringify(bodyToSendToClient);
      }
      try {
        // Log the response
        lokiLog(
          level,
          {
            message: `Sending response for: ${req.method} ${req.originalUrl}`,
            requestId: request?.id,
            statusCode: res.statusCode,
            body: sanitizeForLog(parseSafely(bodyToSendToClient)), // sanitize the body
          },
          { direction: 'response' }
        );
      } catch (error) {
        // ** If parsing or logging fails, log a warning instead of crashing **
        lokiLog(
          'warn',
          {
            message: 'Failed to parse or log response body.',
            requestId: request.id,
            statusCode: res.statusCode,
            error: error instanceof Error ? error.message : String(error),
          },
          { direction: 'response' }
        );
      }
      // Call the original res.send to actually send the response to the client
      return originalSend.call(res, bodyToSendToClient);
    };
  } catch (error) {
    // Top-level catch block
    logger.error(
      'FATAL: Logging middleware encountered an unrecoverable error.',
      error
    );
  }

  //---------------------------------- in app logging -----------------------
  res.on('finish', () => {
    // extract status code
    const status = res.statusCode;

    // define color
    // eslint-disable-next-line no-unused-vars
    let statusColor: (msg: string) => string;

    if (status >= 200 && status < 300) {
      // we show green for success message
      statusColor = chalk.green;
    } else if (status >= 400) {
      // we show red for failed messages
      statusColor = chalk.red;
    } else {
      // other 3XX codes are shown in yellow
      statusColor = chalk.yellow;
    }

    logger.info(
      `${req.method} ${req.originalUrl} from ${req.ip} - ${statusColor(res.statusCode.toString())}`
    );
  });
  next();
};
