export interface PaginationLimits {
  limit: {
    min: number;
    max: number;
    default: number;
  };
  start: {
    default: number;
  };
}

/**
 * Validates and returns a numerical limit within specified constraints.
 *
 * @param limit - The input limit as a string or undefined.
 * @param limits - An object containing min, max, and default limit values.
 * @returns The validated limit as a number, clamped between the min and max values.
 */

export const getValidatedLimit = (
  limit: string | undefined | number,
  limits: PaginationLimits['limit']
): number => {
  return Math.max(
    limits.min,
    Math.min(limits.max, Number(limit) || limits.default)
  );
};

/**
 * Validates and returns a numerical start value within specified constraints.
 *
 * @param start - The input start as a string or undefined.
 * @param defaultStart - The default start value if the input is invalid or undefined. Defaults to 0.
 * @returns The validated start as a number, clamped to a minimum of 0.
 */
export const getValidatedStart = (
  start: string | undefined | number,
  defaultStart: number = 0
): number => {
  return Math.max(0, Number(start) || defaultStart);
};
