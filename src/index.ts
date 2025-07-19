// main starting point
import express, { Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { requestLogger } from './common/middleware/request-logger';
import { devLogger } from './common/utils/logger';
import allRoutes from './routes/index';
import swaggerSpec from './common/swagger/swagger.config';
import swaggerUi from "swagger-ui-express"

// configure .env
dotenv.config();
const app = express();

// connect to database
mongoose
  .connect(process.env.MONGO_URI ?? '')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error connecting to database');
    devLogger(JSON.stringify(err, null, 2));
  });

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware to log all requests
app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// base Route
app.get('/', (_, res: Response) => {
  res.send('This is media logger backend');
});

// all routes
app.use('/api', allRoutes);

// Start the server
export default app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
