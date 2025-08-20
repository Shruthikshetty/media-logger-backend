# Phase 2 Api Planning and Timeline

### Auth

- **GET /api/auth/verify**: Check if the token is valid

### analytic

- **GET /dashboard-admin**: get all the analytics data required for admin dashboard

## Timeline Estimates

## Auth

| Feature/Area               | Estimated Days | Notes                                                       |
| -------------------------- | -------------- | ----------------------------------------------------------- |
| Token validation endpoint  | 1              | Implement **POST /api/auth/verify** to check token validity |
| Middleware integration     | 0              | Use existing passport method to validate                    |
| Error handling consistency | 0              | Standardized error responses for expired/invalid tokens     |
| Unit testing (auth flows)  | 1              | Jest tests for token verification + invalid/expired cases   |
| Swagger docs (auth)        | 1              | Document headers, request/response examples                 |
| Buffer/Debug/Refactor      | 1              | Final polish, refactoring, and bug fixes                    |

---

## Analytics

| Feature/Area               | Estimated Days | Notes                                                                |
| -------------------------- | -------------- | -------------------------------------------------------------------- |
| Analytics endpoint         | 1              | Implement **GET /api/analytic/dashboard-admin** to fetch required analytics data  |
| Data aggregation logic     | 1              | Efficient queries/aggregations (users, content, traffic, etc.)       |
| Error handling consistency | 1              | Standard error format across analytics response                      |
| Response structuring       | 1              | Consistent, reusable response shape                                  |
| Unit testing (analytics)   | 1              | Cover dataset correctness + edge cases (empty, partial, large scale) |
| Swagger docs (analytics)   | 1              | Example queries + schema                                             |
| Buffer/Debug/Refactor      | 1              | Polish, debug, optimize queries                                      |

**Total Estimated Phase 2 Time:** **~3 days** (solo effort; pace may vary depending on final endpoint count and feature depth)

## Tasks Specific to Swagger Docs & Testing

### Swagger Documentation

- [ ] Write/review OpenAPI schemas for all endpoints (models, responses).
- [ ] Add detailed request/response examples.
- [ ] Annotate security for all protected routes.
- [ ] Validate YAML with linter (Swagger Editor).

### Testing (Jest)

- [ ] Unit tests for all CRUD endpoints (positive & negative cases).