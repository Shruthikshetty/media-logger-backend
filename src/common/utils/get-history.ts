import History from '../../models/history.model';

/**
 * Get history with pagination and sorting by createdAt in descending order
 * If fullDetails is 'true', it will populate the user field
 * @param {Object} options - The options to get history with pagination and sorting
 * @param {string} options.fullDetails - Whether to populate user field
 * @param {number} options.start - The starting index for pagination
 * @param {number} options.limit - The number of items per page
 * @returns {Promise<[Array<History>, number]>} - An array of history and the total count of history
 */
export const getHistoryWithTotal = async ({
  fullDetails,
  start,
  limit,
  sort = 'desc',
}: {
  fullDetails: string;
  start: number;
  limit: number;
  sort?: 'asc' | 'desc';
}) => {
  switch (fullDetails) {
    case 'true':
      return await Promise.all([
        History.find()
          .populate('user', '-password -__v')
          .skip(start)
          .limit(limit)
          .sort({ createdAt: sort === 'asc' ? 1 : -1 })
          .lean()
          .exec(),
        History.countDocuments(),
      ]);
    default:
      return await Promise.all([
        History.find()
          .skip(start)
          .limit(limit)
          .sort({ createdAt: sort === 'asc' ? 1 : -1 })
          .lean()
          .exec(),
        History.countDocuments(),
      ]);
  }
};
