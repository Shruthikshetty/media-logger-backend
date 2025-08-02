"use strict";
/**
 * This @file contains the swagger configuration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dotenv_1 = __importDefault(require("dotenv"));
// configure .env
dotenv_1.default.config();
const options = {
    // basic swagger info
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Media Logger API',
            version: '1.0.0',
            description: 'API documentation for Movie logger application',
            contact: {
                name: 'Shruthik shetty',
                email: 'github.com/shruthikshetty',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Local Server',
            },
            {
                url: process.env.PROD_URL,
                description: 'Production Server',
            },
        ],
    },
    // Path to the API docs files
    apis: ['./src/routes/**/*.ts', './src/common/swagger/schema/**/*.yml'], // pattern to find all route files
};
// generate the swagger spec
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
