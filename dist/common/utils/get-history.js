"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryWithTotal = void 0;
const history_model_1 = __importDefault(require("../../models/history.model"));
/**
 * Get history with pagination and sorting by createdAt in descending order
 * If fullDetails is 'true', it will populate the user field
 * @param {Object} options - The options to get history with pagination and sorting
 * @param {string} options.fullDetails - Whether to populate user field
 * @param {number} options.start - The starting index for pagination
 * @param {number} options.limit - The number of items per page
 * @returns {Promise<[Array<History>, number]>} - An array of history and the total count of history
 */
const getHistoryWithTotal = async ({ fullDetails, start, limit, sort = 'desc', }) => {
    switch (fullDetails) {
        case 'true':
            return await Promise.all([
                history_model_1.default.find()
                    .populate('user', '-password -__v')
                    .skip(start)
                    .limit(limit)
                    .sort({ createdAt: sort === 'asc' ? 1 : -1 })
                    .lean()
                    .exec(),
                history_model_1.default.countDocuments(),
            ]);
        default:
            return await Promise.all([
                history_model_1.default.find()
                    .skip(start)
                    .limit(limit)
                    .sort({ createdAt: sort === 'asc' ? 1 : -1 })
                    .lean()
                    .exec(),
                history_model_1.default.countDocuments(),
            ]);
    }
};
exports.getHistoryWithTotal = getHistoryWithTotal;
