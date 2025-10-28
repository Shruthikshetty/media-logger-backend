[![CI Checks for Pull Request on master](https://github.com/Shruthikshetty/media-logger-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Shruthikshetty/media-logger-backend/actions/workflows/ci.yml)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Shruthikshetty/media-logger-backend?utm_source=oss&utm_medium=github&utm_campaign=Shruthikshetty%2Fmedia-logger-backend&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

# Media Logger App

A backend for comprehensive media logging application that allows users to log and track their favorite games, TV shows, and movies.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **API Documentation:** Swagger (OpenAPI)
- **Testing:** Jest

## Features

- Log games, TV shows, and movies with ease
- Track your progress and updates for each media type
- Store and manage your media library in one place

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm
- MongoDB
- Git

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone <http url>
    cd media-logger-backend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    - Copy the example environment file:
      ```sh
      cp .env.example .env
      ```
    - Open the `.env` file and add your configuration values (e.g., your MongoDB URI and a JWT secret).

4.  **Start the development server:**
    - The server will run with hot-reloading at the port specified in your `.env` file.
    ```sh
    npm run dev
    ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file.

- `PORT`: The port the application will run on (e.g., 3001)
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key for signing JSON Web Tokens.
- `NODE_ENV`: The application environment (`development` or `production`)
- `PROD_URL`: Live server url
- `CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_SECRET`: Your Cloudinary API secret.
- `LOKI_HOST`: Your Loki host.
- `LOKI_USERNAME`: Your Loki username.
- `LOKI_API_KEY`: Your Loki API key.

## Testing

To run the tests, use the following command:

```
npm run test
```

## Configuration

The application uses the following configuration files:

- `.prettierrc`: configuration file for Prettier
- `jest.config.js`: configuration file for Jest

## API Documentation

The full, interactive API documentation is available via Swagger UI once the server is running.

Navigate to: `http://localhost:3001/api-docs`

## Project folder structure

```text
src/
├── controllers/    # Business logic handlers
├── models/         # Database schemas and models
├── routes/         # API endpoint definitions
├── common/         # Shared utilities and middleware
│   ├── middleware/ # Custom middleware components
│   ├── utils/      # Utility functions
│   ├── validation-schema/ # Zod validation schemas
│   ├── constants/  # Application constants
│   └── config/     # Configuration files
└── types/          # TypeScript type definitions

```

## Contributing

Contributions are welcome! If you'd like to contribute to the Media Logger App, please fork the repository and submit a pull request.

## License

The Media Logger App is licensed under the MIT License.
