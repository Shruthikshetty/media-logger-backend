# Phase 5 API Planning and Timeline

## User Library Management (Media Entry)

### Overview

Phase 5 focuses on the core functionality of the "Media Logger" aspect: allowing authenticated users to manage their personal collections. This involves CRUD operations for `MediaEntry` documents, enabling users to track status (Planning, Playing, Completed, Dropped) and rate content. It also includes complex filtering to sort through personal backlogs.

## Discovery & Contextual Data

### Overview

This sub-phase enhances the general "browse" experience by injecting user context into public data. The "Discover" endpoints fetch general games, movies, and shows but populate them with the user's existing entry data (e.g., showing a "Played" badge on a game card in the browse feed without needing a secondary API call).

---

## Media Entry Endpoints

- **GET /api/media-entry**: Retrieve the user's media list (paginated).
- **GET /api/media-entry/{id}**: Get a specific media entry by its internal ID.
- **GET /api/media-entry/by-media**: Utility endpoint to check if a specific game/movie exists in the user's library (uses `mediaItem` and `onModel` query params).
- **POST /api/media-entry**: Create a new tracking entry (Status, Rating).
- **PATCH /api/media-entry/{id}**: Update an existing entry's status or rating.
- **POST /api/media-entry/filter**: Advanced search/filtering for the user's personal library (supports sort, status, rating ranges).
- **DELETE /api/media-entry/{id}**: Remove an entry from the library.

## Discovery Endpoints

- **GET /api/discover/games**: Fetch popular/trending games with populated user states (e.g., `status: 'Completed'`).
- **GET /api/discover/movies**: Fetch movies with populated user states.
- **GET /api/discover/tv-show**: Fetch TV shows with populated user states.

---

# Timeline Estimates

## User Library (Media Entry)

| Feature/Area                  | Estimated Days | Notes                                                                                                                                                                 |
| :---------------------------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schema & Validation**       | 0.5            | Define Mongoose schema for `MediaEntry`. Set up Zod/Joi validation for enums (Status, onModel) and rating ranges (1-10).                                              |
| **Basic CRUD Implementation** | 1.0            | Implement Create, Read (Single/List), Update, and Delete controllers. Ensure `user_id` is extracted securely from the Auth token.                                     |
| **"By-Media" Lookup**         | 0.5            | Implement `GET /by-media`. Optimized index query to quickly check "Is this game in my library?" for frontend button states.                                           |
| **Advanced Filtering Logic**  | 1.5            | Implement the `POST /filter` logic. Build dynamic MongoDB aggregation or query builders to handle combinations of `onModel`, `rating`, `status`, and sorting options. |
| **Unit Testing (Library)**    | 1.5            | Jest tests for all CRUD operations, ensuring users cannot modify entries that don't belong to them. Test filter permutations.                                         |
| **Swagger Docs (Library)**    | 0.5            | Document request bodies for POST/PATCH and query parameters for filtering.                                                                                            |

## Discovery Integration

| Feature/Area               | Estimated Days | Notes                                                                                                                             |
| :------------------------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Aggregation Strategy**   | 1.0            | Design the MongoDB `$lookup` or application-level merge logic to combine Public Media data with Private User Entries efficiently. |
| **Games Discovery**        | 0.5            | Implement `GET /discover/games`. Ensure pagination works while maintaining the "user status" overlay.                             |
| **Movies/Shows Discovery** | 0.5            | Implement `GET /discover/movies` and `/discover/tv-show` reusing the aggregation logic defined above.                             |
| **Performance Tuning**     | 0.5            | Analyze query performance. Ensure "populated" fields don't cause N+1 query issues or slow down the main browse feed.              |
| **Testing (Discovery)**    | 1.0            | Test that user data appears correctly when a user is logged in, and handles "null" states gracefully for new users.               |

**Total Estimated Phase 5 Time: ~8-9 days** (Solo effort)

## Tasks Breakdown

### Development Tasks

- [ ] Create Mongoose model for `MediaEntry` (fields: `user`, `mediaItem`, `onModel`, `status`, `rating`, `timestamps`).
- [ ] Implement `MediaEntryController` with standard CRUD methods.
- [ ] Implement `checkMediaExistence` controller logic for the `/by-media` endpoint.
- [ ] Build the **Filter Builder** utility:
  - [ ] Handle pagination (`limit`, `page`).
  - [ ] Handle sorting (`sortBy`, `sortOrder`).
  - [ ] Handle multiple filter criteria (`rating`, `status`, `onModel`).
- [ ] Implement `DiscoveryController`:
  - [ ] Create aggregation pipeline to fetch Media items + `$lookup` current user's entry.
  - [ ] Handle "Guest" vs "Auth" logic (if guest, return raw data; if auth, return enriched).
- [ ] Add unique constraint validation: User cannot add the same Game twice.

### Testing Tasks (Jest)

- [ ] add related e2e test for applicable endpoints
- [ ] add unit test for all the controllers and necessary utils 


### Swagger Documentation

- [ ] Document all the endpoints with req and res payloads
