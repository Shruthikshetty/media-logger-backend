"use strict";
/**
 * @file contains utility functions related to analytics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processContentDayWise = exports.calculateChangeBetweenTwoNumbers = void 0;
/**
 * Calculate the percentage change between two numbers and whether the change is up or down
 * @param {number} n1 The original number
 * @param {number} n2 The new number
 */
const calculateChangeBetweenTwoNumbers = (n1, n2) => {
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
exports.calculateChangeBetweenTwoNumbers = calculateChangeBetweenTwoNumbers;
// Helper function to process each result set
const processContentDayWise = (counts, type, dailyDataMap) => {
    counts.forEach((item) => {
        const date = item._id;
        if (!dailyDataMap.has(date)) {
            dailyDataMap.set(date, { movies: 0, tvShows: 0, games: 0 });
        }
        const entry = dailyDataMap.get(date);
        entry[type] = item.count;
    });
};
exports.processContentDayWise = processContentDayWise;
