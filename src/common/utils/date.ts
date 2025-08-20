/**
 * @file contains utility functions related to date
 */
import moment, { Moment } from 'moment';

/**
 * Returns the current date and time.
 */
export const getCurrentDate = () => {
  return moment();
};

/**
 * Returns a moment object of a given number of days ago from the current date and time
 */
export const getDaysAgo = (days: number): Moment => {
  return moment().subtract(days, 'days');
};

/**
 * get week day names in order based on current date
 */
export const getWeekDays = () => {
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = moment().subtract(i, 'days');
    weekDays.push(date.format('ddd'));
  }
  return weekDays;
};
