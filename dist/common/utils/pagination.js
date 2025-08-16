'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPaginationResponse =
  exports.getPaginationParams =
  exports.getValidatedStart =
  exports.getValidatedLimit =
    void 0;
/**
 * Validates and returns a numerical limit within specified constraints.
 *
 * @param limit - The input limit as a string or undefined.
 * @param limits - An object containing min, max, and default limit values.
 * @returns The validated limit as a number, clamped between the min and max values.
 */
const getValidatedLimit = (limit, limits) => {
  return Math.max(
    limits.min,
    Math.min(limits.max, Number(limit) || limits.default)
  );
};
exports.getValidatedLimit = getValidatedLimit;
/**
 * Validates and returns a numerical start value within specified constraints.
 *
 * @param start - The input start as a string or undefined.
 * @param defaultStart - The default start value if the input is invalid or undefined. Defaults to 0.
 * @returns The validated start as a number, clamped to a minimum of 0.
 */
const getValidatedStart = (start, defaultStart = 0) => {
  return Math.max(0, Number(start) || defaultStart);
};
exports.getValidatedStart = getValidatedStart;
/**
 * Extracts and validates pagination parameters from a query object.
 *
 * @param query - The query object .
 * @param limits - An object defining min, max, and default values for limit and default start value.
 * @returns An object with validated numerical limit and start values.
 */
const getPaginationParams = (query, limits) => {
  // Get limit and start , page from query
  const { limit, start, page } = query;
  // Validate limit
  const validatedLimit = Math.max(
    limits.limit.min,
    Math.min(limits.limit.max, Number(limit) || limits.limit.default)
  );
  // Calculate start
  let validatedStart;
  if (page) {
    const pageNumber = Math.max(1, Number(page) || 1);
    validatedStart = (pageNumber - 1) * validatedLimit;
  } else {
    validatedStart = Math.max(0, Number(start) || limits.start.default);
  }
  return {
    limit: validatedLimit,
    start: validatedStart,
  };
};
exports.getPaginationParams = getPaginationParams;
/**
 * Generates a pagination response object containing metadata about the current paging state.
 *
 * @param total - The total number of items available.
 * @param limit - The maximum number of items per page.
 * @param start - The starting index of the current page.
 * @returns An object containing pagination details such as total items, start index,
 *          items per page, current page number, total pages, and navigation flags.
 */
const getPaginationResponse = (total, limit, start) => {
  const currentPage = Math.floor(start / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    start,
    limit,
    currentPage,
    totalPages,
    hasMore: start + limit < total,
    hasPrevious: start > 0,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
  };
};
exports.getPaginationResponse = getPaginationResponse;
