# Phase 3 API Planning and Timeline

## History

- **GET /api/history**: get all the history with pagination
- **GET /api/history/filter**: Get all history entries with support for pagination and filtering by `date`, `action`, `entity_type`, and `media_id`.

## Infrastructure

- **Centralized Logging (Loki)**: No new endpoints. This involves creating a global middleware to capture all request and response data and send it to a centralized Loki instance for monitoring and debugging.
- **Request Tracing**: Implement a middleware to add a unique `X-Request-ID` header to every incoming request and outgoing response to allow for better tracking and correlation of logs.

# Timeline Estimates

## History

| Feature/Area                | Estimated Days | Notes                                                                                             |
| :-------------------------- | :------------- | :------------------------------------------------------------------------------------------------ |
| History pagination endpoint | 1              | Implement **GET /api/history** with pagination and sort by `date` in descending order.            |
| History filtering endpoint  | 1.5            | Implement **GET /api/history/filter** with dynamic query building for all specified filters.      |
| Pagination implementation   | 0.5            | Integrate robust and reusable pagination logic.                                                   |
| Database query optimization | 0.5            | Ensure proper indexing on `date`, `action_type`, `entity_type`, and `media_id` for performance.   |
| Error handling consistency  | 0.2            | Standardized error responses for invalid filter parameters or other issues.                       |
| Unit testing (history)      | 1              | Jest tests covering various filter combinations, pagination edge cases, and response correctness. |
| Swagger docs (history)      | 0.5            | Document all query parameters, the response schema, and provide clear examples.                   |
| Buffer/Debug/Refactor       | 1              | Final polish, query optimization, and bug fixes.                                                  |

---

## Logging & Infrastructure

| Feature/Area                    | Estimated Days | Notes                                                                                                         |
| :------------------------------ | :------------- | :------------------------------------------------------------------------------------------------------------ |
| Request ID middleware           | 0.5            | Create middleware to generate and inject a unique `X-Request-ID` into requests and responses.                 |
| Loki logging service/middleware | 2              | Set up a Node.js Loki client (e.g., `winston-loki`), and create a middleware to log request/response details. |
| Global middleware integration   | 0.5            | Apply the Request ID and Logging middleware to all API routes in the application.                             |
| Unit testing (logging)          | 1              | Test that middleware correctly attaches IDs and that the logger is called with the expected data format.      |
| Swagger docs (global)           | 0.2            | Document the global `X-Request-ID` response header.                                                           |
| Buffer/Debug/Refactor           | 1              | Time for configuration, debugging connections to Loki, and ensuring minimal performance impact.               |

**Total Estimated Phase 3 Time:** **~11-12 days** (solo effort; pace may vary depending on infrastructure complexity and debugging)

## Tasks Specific to Swagger Docs & Testing

### Swagger Documentation

- [ ] Write/review OpenAPI schemas for the new history endpoint.
- [ ] Add detailed request/response examples for history filtering.
- [ ] Document the global `X-Request-ID` header in the API overview.
- [ ] Ensure all history query parameters are clearly defined with examples.
- [ ] Validate final YAML with a linter (Swagger Editor).

### Testing (Jest)

- [ ] Unit tests for the history endpoint covering all filter combinations.
- [ ] Test pagination logic thoroughly (first, middle, last, empty pages).
- [ ] Test for negative cases, such as invalid filter values.
- [ ] Create tests for the Request ID middleware to ensure ID injection.
- [ ] Write tests to mock and verify that the logging middleware is triggered correctly on requests.
