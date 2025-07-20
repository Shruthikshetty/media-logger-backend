# Phase 1 API Planning & Timeline

## Tech Stack (Initial)

- **Backend Framework**: Node.js (Express)
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Authentication**: JWT Bearer Token
- **API Documentation**: OpenAPI (Swagger)
- **Testing**: Jest (unit/integration tests)
- **Code Style/Quality**: ESLint, Prettier

## Endpoint Overview

### Games API

- **POST /api/game**: Add a new game.
- **GET /api/game?limit=xx&page=XX&start=XX**: List all games, with pagination/sorting.
- **GET /api/game/:id**: Fetch a single game by ID.
- **PATCH /api/game/:id**: Update a game's details.
- **DELETE /api/game/:id**: Remove a game.
- **GET /api/game/search**: Advanced search (title/genre/platform).
- **POST /api/game/bulk**: Bulk addition (JSON upload).
- **DELETE /api/game/bulk**: Bulk delete by IDs.

### Movies API

- **POST /api/movie**: Add a new movie.
- **GET /api/movie?limit=xx&page=XX&start=XX**: List movies, with filters and sorting.
- **GET /api/movie/:id**: Fetch details of a movie.
- **PATCH /api/movie/:id**: Edit movie info.
- **DELETE /api/movie/:id**: Delete a movie.
- **GET /api/movie/search**: Advanced search (text, genre, year, rating).
- **POST /api/movie/bulk**: Bulk addition (supporting JSON).
- **DELETE /api/movie/bulk**: Bulk delete of multiple movies.

### TV Shows API

- **POST /api/tv-show**: Add a new TV show (nested seasons/episodes).
- **GET /api/tv-show**: List all TV shows, with pagination and filtering.
- **GET /api/tv-show/:id**: Get detail of a specific TV show.
- **PATCH /api/tv-show/:id**: Update TV show info.
- **DELETE /api/tv-show/:id**: Remove a TV show.
- **POST /api/tv-show/season**: Add a season to a TV show.
- **PATCH /api/tv-show/season/:id**: Update a season.
- **DELETE /api/tv-show/season/:id**: Remove a season.
- **POST /api/tv-show/episode**: Add an episode to a season.
- **PATCH /api/tv-show/episode/:id**: Update episode info.
- **DELETE /api/tv-show/episode/:id**: Delete an episode.
- **GET /api/tv-show/search**: Advanced search (text, genre, cast).
- **POST /api/tv-show/bulk**: Bulk addition for TV shows.
- **DELETE /api/tv-show/bulk**: Bulk delete of shows.

### User & Auth

- **POST /api/user**: Register a new user.
- **POST /api/auth/login**: JWT-based login.
- **GET /api/user**: Fetch current user's profile.
- **PATCH /api/user**: Edit current user's details.
- **GET /api/user/all**: Fetch all users.
- **GET /api/user/all?start=0&limit=10**: Fetch all users with pagination.
- **GET /api/user/all?page=1&limit=10**: Fetch all users page-based.
- **DELETE /api/user**: Delete the logged in user.
- **DELETE /api/user/:id**: Delete a user by ID.
- **PATCH /api/user/role/:id**: Update a user's role by ID.

## Timeline Estimates

| Feature/Area                | Estimated Days | Notes                              |
| --------------------------- | -------------- | ---------------------------------- |
| Complete all CRUD endpoints | 5              | Ensure all basic add/update/delete |
| Advanced search/filter      | 5              | All media types, with pagination   |
| Bulk operations             | 3              | CSV/JSON imports, batch deletes    |
| Consistent error handling   | 2              | Across all endpoints               |
| Response standardization    | 1              | Uniform data structure/messages    |
| **Swagger docs**            | 2              | OpenAPI annotation, deep examples  |
| **Testing (unit)**          | 3              | Jest tests for all endpoints       |
| **Buffer/Debug/Refactor**   | 2              | Final polish, bug fixes            |

**Total Estimated Phase 1 Time:** **~26 days** (solo effort; pace may vary depending on final endpoint count and feature depth)

## Tasks Specific to Swagger Docs & Testing

### Swagger Documentation

- [ ] Write/review OpenAPI schemas for all endpoints (models, responses).
- [ ] Add detailed request/response examples.
- [ ] Annotate security for all protected routes.
- [ ] Validate YAML with linter (Swagger Editor).

### Testing (Jest)

- [ ] Unit tests for all CRUD endpoints (positive & negative cases).
