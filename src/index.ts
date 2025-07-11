// main starting point
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// configure .env
dotenv.config();
const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Example Route
app.get('/', (_, res: Response) => {
  res.send('Hello TypeScript with Express! Enjoy');
});
export const getExample = (_: Request, res: Response) => {
  res.json({ message: 'This is a sample endpoint' });
};
// Example Route to test a controller
app.get('/example', getExample);

// Start the server
export default app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
