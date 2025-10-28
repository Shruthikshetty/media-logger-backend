/**
 * @file defines the express app
 */
import express, { Response } from 'express';
import dotenv from 'dotenv';
import { requestLogger } from './common/middleware/request-logger';
import allRoutes from './routes/index';
import swaggerSpec from './common/swagger/swagger.config';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { corsOptions } from './common/config/cors.config';

// configure .env
dotenv.config();
const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

//cors policy middleware
app.use(cors(corsOptions));

// to capture ip address
app.set('trust proxy', true);

// Middleware to log all requests
app.use(requestLogger);

// Middleware for serving Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// base Route
app.get('/', (_, res: Response) => {
  res.send('This is media logger backend');
});

// all routes
app.use('/api', allRoutes);

//export app
export { app };
