import chalk from 'chalk';
import { logger } from '../utils/logger';
import { Request, NextFunction, Response } from 'express';
import { lokiLog } from '../utils/loki-logger';

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
    const requestId = crypto.randomUUID();
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
      },
      { direction: 'request' }
    );

    // Keep a reference to the original res.send
    const originalSend = res.send;
    // Redefine res.send
    res.send = function (body) {
      const level = res.statusCode >= 500 ? 'error' : 'info';
      let parsedBody;
      let modifiedBody = body;
      // Safely attempt to parse JSON only if it's a non-empty string that looks like an object or array
      if (
        typeof body === 'string' &&
        body.length > 0 &&
        (body.trim().startsWith('{') || body.trim().startsWith('['))
      ) {
        parsedBody = JSON.parse(body);
        // If the parsed body is an object, add the requestId
        // as per the apps standard response its always expected to be a object
        if (typeof parsedBody === 'object') {
          parsedBody.requestId = requestId;
          modifiedBody = JSON.stringify(parsedBody); // Re-stringify the modified object
        }
      } else {
        // If not JSON, use the body as-is (if string) or a placeholder
        parsedBody =
          typeof body === 'string' ? body : '[Non-string or empty body]';
      }
      try {
        // Log the response
        lokiLog(
          level,
          {
            message: `Sending response for: ${req.method} ${req.originalUrl}`,
            requestId: request?.id,
            statusCode: res.statusCode,
            body: parsedBody, // send the parsed body
          },
          { direction: 'response' }
        );
      } catch (error) {
        // ** If parsing or logging fails, log a warning instead of crashing **
        lokiLog(
          'warn',
          {
            message:
              'Failed to parse or log response body. Logging raw content.',
            requestId: request.id,
            statusCode: res.statusCode,
            error: error instanceof Error ? error.message : String(error),
            rawBody: body, // Include the raw body for debugging purposes
          },
          { direction: 'response' }
        );
      }
      // Call the original res.send to actually send the response to the client
      return originalSend.call(res, modifiedBody);
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
