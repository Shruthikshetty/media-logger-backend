"use strict";
/**
 * This file contains the controller related to history
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryByFilters = exports.getAllHistory = void 0;
const config_constants_1 = require("../common/constants/config.constants");
const pagination_1 = require("../common/utils/pagination");
const handle_error_1 = require("../common/utils/handle-error");
const get_history_1 = require("../common/utils/get-history");
const history_model_1 = __importDefault(require("../models/history.model"));
// controller to get all the history
const getAllHistory = async (req, res) => {
    try {
        const { fullDetails } = req.query;
        // get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_HISTORY_LIMITS);
        // find all history
        const [history, total] = await (0, get_history_1.getHistoryWithTotal)({
            fullDetails: fullDetails ?? 'false',
            start,
            limit,
        });
        // get pagination details
        const pagination = (0, pagination_1.getPaginationResponse)(total, limit, start);
        // send response
        res.status(200).json({
            success: true,
            data: {
                history,
                pagination,
            },
        });
    }
    catch (err) {
        // handle any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getAllHistory = getAllHistory;
// controller to get history by filters
const getHistoryByFilters = async (req, res) => {
    try {
        // destructure validated data
        const { action, bulk, entityType, fullDetails, ...pagination } = req.validatedData;
        // get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(pagination, config_constants_1.GET_ALL_HISTORY_LIMITS);
        //define a filter and pipeline
        const pipeline = [];
        const filters = {};
        // add filters if they are present
        if (action) {
            filters.action = action;
        }
        if (bulk !== undefined) {
            filters.bulk = bulk;
        }
        if (entityType) {
            filters.entityType = entityType;
        }
        // Add the $match stage only if there are filters
        if (Object.keys(filters).length > 0) {
            pipeline.push({ $match: filters });
        }
        //in case we need full details
        if (fullDetails === true) {
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            }, 
            // unwind the user array to a single document(object)
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true,
                },
            }, 
            // remove sensitive data
            {
                $project: {
                    'userDetails.password': 0,
                },
            });
        }
        // Use $facet to get both data and total count in one query
        pipeline.push({
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: start },
                    { $limit: limit },
                ],
                totalCount: [{ $count: 'total' }],
            },
        });
        //execute the pipeline
        const results = await history_model_1.default.aggregate(pipeline).exec();
        // extract the history data and pagination details from result
        const facet = results[0] ?? { data: [], totalCount: [] };
        const history = Array.isArray(facet.data) ? facet.data : [];
        const total = facet.totalCount?.[0]?.total ?? 0;
        //send response
        res.status(200).json({
            success: true,
            data: {
                history,
                pagination: (0, pagination_1.getPaginationResponse)(total, limit, start),
            },
        });
    }
    catch (err) {
        // handle any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
};
exports.getHistoryByFilters = getHistoryByFilters;
