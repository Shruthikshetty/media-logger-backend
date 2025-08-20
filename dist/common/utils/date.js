"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekDays = exports.getDaysAgo = exports.getCurrentDate = void 0;
/**
 * @file contains utility functions related to date
 */
const moment_1 = __importDefault(require("moment"));
/**
 * Returns the current date and time.
 */
const getCurrentDate = () => {
    return (0, moment_1.default)();
};
exports.getCurrentDate = getCurrentDate;
/**
 * Returns a moment object of a given number of days ago from the current date and time
 */
const getDaysAgo = (days) => {
    return (0, moment_1.default)().subtract(days, 'days');
};
exports.getDaysAgo = getDaysAgo;
/**
 * get week day names in order based on current date
 */
const getWeekDays = () => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const date = (0, moment_1.default)().subtract(i, 'days');
        weekDays.push(date.format('ddd'));
    }
    return weekDays;
};
exports.getWeekDays = getWeekDays;
