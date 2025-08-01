"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// main starting point
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const request_logger_1 = require("./common/middleware/request-logger");
const logger_1 = require("./common/utils/logger");
const index_1 = __importDefault(require("./routes/index"));
const swagger_config_1 = __importDefault(require("./common/swagger/swagger.config"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// configure .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// connect to database
mongoose_1.default
    .connect((_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : '')
    .then(() => {
    console.log('Connected to database');
})
    .catch((err) => {
    console.log('Error connecting to database');
    (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
});
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
// Start the server
exports.default = app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
});
