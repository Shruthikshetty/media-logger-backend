"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @this is the main entry point for the application
 * @this starts the server and connect to the database
 */
const index_1 = require("./index");
const db_connection_config_1 = require("./common/config/db-connection.config");
const logger_1 = require("./common/utils/logger");
// This function starts the application
const startServer = async () => {
    // Connect to the database then start server
    (0, db_connection_config_1.connectDB)()
        .then(() => {
        // Then start the server
        index_1.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
        .catch((error) => {
        console.error('Failed to start server');
        (0, logger_1.devLogger)(JSON.stringify(error, null, 2));
        process.exit(1);
    });
};
// Execute the start function
startServer();
