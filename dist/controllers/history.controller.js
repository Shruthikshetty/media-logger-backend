"use strict";
/**
 * This file contains the controller related to history
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHistory = void 0;
const config_constants_1 = require("../common/constants/config.constants");
const pagination_1 = require("../common/utils/pagination");
const handle_error_1 = require("../common/utils/handle-error");
const get_history_1 = require("../common/utils/get-history");
// controller to get all the history
const getAllHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fullDetails } = req.query;
        // get pagination params
        const { limit, start } = (0, pagination_1.getPaginationParams)(req.query, config_constants_1.GET_ALL_HISTORY_LIMITS);
        // find all history
        const [history, total] = yield (0, get_history_1.getHistoryWithTotal)({
            fullDetails: (_a = fullDetails) !== null && _a !== void 0 ? _a : 'false',
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
});
exports.getAllHistory = getAllHistory;
