"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/**
 * @file defines the express app
 */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const request_logger_1 = require("./common/middleware/request-logger");
const index_1 = __importDefault(require("./routes/index"));
const swagger_config_1 = __importDefault(require("./common/swagger/swagger.config"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// configure .env
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Middleware for parsing JSON request bodies
app.use(express_1.default.json());
// Middleware to log all requests
app.use(request_logger_1.requestLogger);
// Middleware for serving Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default));
// base Route
app.get('/', (_, res) => {
    res.send('This is media logger backend');
});
// all routes
app.use('/api', index_1.default);
