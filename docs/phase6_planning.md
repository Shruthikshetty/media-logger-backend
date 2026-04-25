# Phase 6 API Planning: User-Media Integration & Unified Detail Routes

## Overview

Phase 6 focuses on providing integrated endpoints that bridge public media data (Movies, TV Shows, Games) with private user collection data (`MediaEntry`). The primary goal is to allow the frontend to fetch a single object that contains both the media's static information and the current user's personal status/rating for that media, if it exists.

To clearly communicate that these endpoints merge user context, they will follow the `/:id/with-entry` naming convention.

## Objectives

- Implement "Unified Detail" routes for Movies, TV Shows, and Games using the `/:id/with-entry` path.
- Ensure these routes handle both authenticated and unauthenticated requests gracefully (returning `mediaEntry: null` for guests or if no entry exists).

---

## Proposed Route Changes

### 1. Movie Routes (`/api/movie`)

- **GET /api/movie/:id/with-entry**: Returns full movie details merged with the authenticated user's `MediaEntry`.

### 2. TV Show Routes (`/api/tv-show`)

- **GET /api/tv-show/:id/with-entry**: Returns full TV show details merged with the user's `MediaEntry`.

### 3. Game Routes (`/api/game`)

- **GET /api/game/:id/with-entry**: Returns game details merged with the user's `MediaEntry`.

---

## Technical Details

### Middleware: `optionalAuth`

To support these unified routes, we need a middleware that extracts user information if a token is present but doesn't block the request if it isn't.

- If `req.user` is present, the controller will query `MediaEntry` for `user_id` + `media_id`.
- If `req.user` is absent, `mediaEntry` will be `null`.

### Response Structure

```json
{
  "success": true,
  "data": {
    "media": { ...mediaDetails... },
    "mediaEntry": { ...mediaEntryDetails... } // or null if unauthenticated / no entry
  }
}
```

---

## Tasks Breakdown

### Development Tasks

- [ ] Implement `optionalAuth` middleware.
- [ ] Update `MovieController`:
  - [ ] Create `getMovieDetailWithUserContext` controller.
- [ ] Update `TvShowController`:
  - [ ] Create `getTvShowDetailWithUserContext` controller.
- [ ] Update `GameController`:
  - [ ] Create `getGameDetailWithUserContext` controller.
- [ ] Register new `/:id/with-entry` routes in respective route files.

### Testing Tasks

- [ ] Add unit tests for the new "Detail with User Context" controllers.
- [ ] Add integration tests for guest vs. authenticated user responses.

### Documentation Tasks

- [ ] Update Swagger documentation for all new `/:id/with-entry` endpoints.
