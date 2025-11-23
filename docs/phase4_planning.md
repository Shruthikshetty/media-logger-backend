# Phase 4 API Planning and Timeline

## Recommendation System Integration

### Overview

Phase 4 focuses on integrating a separate recommender microservice to provide similar content recommendations for games, movies, and TV shows. Since the ML service is already built and deployed separately, this phase primarily involves creating API endpoints that communicate with the recommender service.

---

## Recommendation Endpoints

- **GET /api/recommend/similar-games/{id}**: Get a set of similar games for the provided game ID
- **GET /api/recommend/similar-movies/{id}**: Get a set of similar movies for the provided movie ID
- **GET /api/recommend/similar-shows/{id}**: Get a set of similar TV shows for the provided TV show ID

---

# Timeline Estimates

## Recommendation Integration

| Feature/Area                     | Estimated Days | Notes                                                                                                                          |
| :------------------------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| Recommender service client setup | 1              | Create HTTP client/service layer to communicate with the recommender microservice. Handle base URL, timeouts, and retry logic. |
| Similar games endpoint           | 0.5            | Implement **GET /api/recommend/similar-games/{id}**. Validate game ID, call recommender service, format response.               |
| Similar movies endpoint          | 0.5            | Implement **GET /api/recommend/similar-movies/{id}**. Validate movie ID, call recommender service, format response.             |
| Similar shows endpoint           | 0.5            | Implement **GET /api/recommend/similar-shows/{id}**. Validate show ID, call recommender service, format response.               |
| Error handling & fallbacks       | 0.5            | Handle recommender service downtime, timeouts, invalid IDs, and empty results gracefully.                                      |
| Data enrichment                  | 1              | Fetch additional metadata from MongoDB for recommended items (titles, images, ratings) before returning to client.             |
| Unit testing (recommendations)   | 1.5            | Jest tests for all three endpoints covering success cases, invalid IDs, service failures, and caching behavior.                |
| Integration testing              | 1              | End-to-end tests verifying actual communication with the recommender microservice.                                             |
| Swagger docs (recommendations)   | 0.5            | Document all three endpoints with path parameters, response schemas, error codes, and examples.                                |
| Buffer/Debug/Refactor            | 1              | Final testing, performance optimization, and bug fixes.                                                                        |

---

## Configuration & Environment

| Feature/Area                | Estimated Days | Notes                                                                            |
| :-------------------------- | :------------- | :------------------------------------------------------------------------------- |
| Environment variables setup | 0.2            | Add `RECOMMENDER_MS_URL` and related config to `.env` and deployment configs.    |
| Health check endpoint       | 0.3            | Create **GET /api/recommend/health** to verify recommender service connectivity. |

---

**Total Estimated Phase 4 Time:** **~7-8 days** (solo effort; assumes recommender microservice is stable and deployed)

---

## Tasks Breakdown

### Development Tasks

- [ ] Create `recommenderService.js` client with HTTP methods for calling ML service
- [ ] Add error handling wrapper for recommender service calls
- [ ] Implement timeout and retry logic for service communication
- [ ] Build controller for `GET /api/recommend/similar-games/{id}`
- [ ] Build controller for `GET /api/recommend/similar-movies/{id}`
- [ ] Build controller for `GET /api/recommend/similar-shows/{id}`
- [ ] Add validation middleware for media ID parameters
- [ ] Implement data enrichment logic to fetch metadata from MongoDB
- [ ] Set up response caching layer (if implementing)
- [ ] Create health check endpoint for recommender service connectivity

### Testing Tasks (Jest)

- [ ] Unit tests for recommender service client (mock HTTP calls)
- [ ] Test similar-game endpoint with valid and invalid IDs
- [ ] Test similar-movie endpoint with valid and invalid IDs
- [ ] Test similar-show endpoint with valid and invalid IDs

### Swagger Documentation

- [ ] Document **GET /api/recommend/similar-games/{id}** with path parameters and response schema
- [ ] Document **GET /api/recommend/similar-movies/{id}** with path parameters and response schema
- [ ] Document **GET /api/recommend/similar-shows/{id}** with path parameters and response schema
- [ ] Add example responses for successful recommendations (with enriched data)
- [ ] Document error responses (404 for invalid ID, 503 for service unavailable, 500 for server errors)
- [ ] Add notes about response time expectations and caching behavior
- [ ] Document **GET /api/recommend/health** endpoint

---
