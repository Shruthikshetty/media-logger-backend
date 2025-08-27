# Phase 2 API Planning and Timeline

## Auth

- **GET /api/auth/verify**: Check if the token is valid
- **GET /api/auth/**: Update this API to return user details

## Analytics

- **GET /api/analytic/dashboard-admin**: Get all analytics data required for the admin dashboard

## Uploads

- **POST /api/upload/image**: upload an image (used for profile images, etc.)

# Timeline Estimates

## Auth

| Feature/Area               | Estimated Days | Notes                                                      |
| -------------------------- | -------------- | ---------------------------------------------------------- |
| Token validation endpoint  | 0.2            | Implement **GET /api/auth/verify** to check token validity |
| Middleware integration     | 0              | Use existing passport method to validate                   |
| Error handling consistency | 0              | Standardized error responses for expired/invalid tokens    |
| Unit testing (auth flows)  | 0.5            | Jest tests for token verification + invalid/expired cases  |
| Swagger docs (auth)        | 0.5            | Document headers, request/response examples                |
| Buffer/Debug/Refactor      | 1              | Final polish, refactoring, and bug fixes                   |

---

## Analytics

| Feature/Area               | Estimated Days | Notes                                                                            |
| -------------------------- | -------------- | -------------------------------------------------------------------------------- |
| Analytics endpoint         | 0.2            | Implement **GET /api/analytic/dashboard-admin** to fetch required analytics data |
| Data aggregation logic     | 0.2            | Efficient queries/aggregations (users, content, traffic, etc.)                   |
| Error handling consistency | 0              | Standard error format across analytics response                                  |
| Response structuring       | 1              | Consistent, reusable response shape                                              |
| Unit testing (analytics)   | 0.5            | Cover dataset correctness + edge cases (empty, partial, large scale)             |
| Swagger docs (analytics)   | 0.5            | Example queries + schema                                                         |
| Buffer/Debug/Refactor      | 1              | Polish, debug, optimize queries                                                  |

## Uploads

| Feature/Area               | Estimated Days | Notes                                                                                 |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| Image upload endpoint      | 0.5            | Implement **POST /api/upload/image** to upload images (used for profile images, etc.) |
| Multer setup               | 0.5            | Configure Multer (local storage, file limits, etc.)                                   |
| Error handling consistency | 0              | Standard error format across upload response                                          |
| Response structuring       | 0.5            | Consistent, reusable response shape                                                   |
| Unit testing (uploads)     | 0.5            | Cover dataset correctness + edge cases (empty, partial, large scale)                  |
| Swagger docs (uploads)     | 0.5            | Example queries + schema                                                              |
| Buffer/Debug/Refactor      | 1              | Polish, debug, optimize queries                                                       |

**Total Estimated Phase 2 Time:** **~5-6 days** (solo effort; pace may vary depending on final endpoint count and feature depth)

## Tasks Specific to Swagger Docs & Testing

### Swagger Documentation

- [ ] Write/review OpenAPI schemas for all endpoints (models, responses).
- [ ] Add detailed request/response examples.
- [ ] Annotate security for all protected routes.
- [ ] Validate YAML with linter (Swagger Editor).

### Testing (Jest)

- [ ] Unit tests for all CRUD endpoints (positive & negative cases).
