/**
 * @file contains utility functions related to analytics
 */

/**
 * Calculate the percentage change between two numbers and whether the change is up or down
 * @param {number} n1 The original number
 * @param {number} n2 The new number
 */
export const calculateChangeBetweenTwoNumbers = (
  n1: number,
  n2: number
): {
  percentage: number;
  change: 'up' | 'down';
} => {
  //in case n1 is 0
  if (n1 === 0) {
    return {
      percentage: n2 > 0 ? 100 : 0,
      change: n2 > 0 ? 'up' : 'down',
    };
  }
  return {
    percentage: Math.abs(Math.round(((n2 - n1) / n1) * 100)),
    change: n2 > n1 ? 'up' : 'down',
  };
};

export type DailyCounts = { movies: number; tvShows: number; games: number };
export type DailyCountsMap = Map<string, DailyCounts>;
// Helper function to process each result set
export const processContentDayWise = (
  counts: Array<{ _id: string; count: number }>,
  type: 'movies' | 'tvShows' | 'games',
  dailyDataMap: DailyCountsMap
) => {
  counts.forEach((item) => {
    const date = item._id;
    if (!dailyDataMap.has(date)) {
      dailyDataMap.set(date, { movies: 0, tvShows: 0, games: 0 });
    }
    const entry = dailyDataMap.get(date)!;
    entry[type] = item.count;
  });
};
