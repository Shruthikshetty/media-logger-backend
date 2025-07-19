/**
 * This @file contains the swagger configuration
 */

import swaggerJSDoc from 'swagger-jsdoc';


const options: swaggerJSDoc.Options = {
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
    // live server is not mentioned for security reasons
  ],
  },

  // Path to the API docs files
  apis: ['./src/routes/**/*.ts', './src/common/swagger/schema/**/*.yml']

, // pattern to find all route files
};

// generate the swagger spec
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
