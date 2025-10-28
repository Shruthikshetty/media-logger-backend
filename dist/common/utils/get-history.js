"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const getHistoryWithTotal = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullDetails, start, limit, sort = 'desc', }) {
    switch (fullDetails) {
        case 'true':
            return yield Promise.all([
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
            return yield Promise.all([
                history_model_1.default.find()
                    .skip(start)
                    .limit(limit)
                    .sort({ createdAt: sort === 'asc' ? 1 : -1 })
                    .lean()
                    .exec(),
                history_model_1.default.countDocuments(),
            ]);
    }
});
exports.getHistoryWithTotal = getHistoryWithTotal;
