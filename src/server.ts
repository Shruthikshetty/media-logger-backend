/**
 * @this is the main entry point for the application
 * @this starts the server and connect to the database
 */
import { app } from './index';
import { connectDB } from './common/config/db-connection.config';
import { devLogger } from './common/utils/logger';

// This function starts the application
const startServer = async () => {
  // Connect to the database then start server
  connectDB()
    .then(() => {
      // Then start the server
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server');
      devLogger(JSON.stringify(error, null, 2));
      process.exit(1);
    });
};

// Execute the start function
startServer();
