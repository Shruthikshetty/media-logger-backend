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
exports.getSimilarMedia = getSimilarMedia;
const axios_1 = __importDefault(require("axios"));
const handle_error_1 = require("./handle-error");
const mongo_errors_1 = require("./mongo-errors");
const config_constants_1 = require("../constants/config.constants");
// common utility to fetch and send similar media from recommender based on the config passed
function getSimilarMedia(req, res, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get the id from the request
            const { id } = req.params;
            if (!id || !(0, mongo_errors_1.isMongoIdValid)(id)) {
                (0, handle_error_1.handleError)(res, {
                    message: `Invalid ${config.mediaType} id`,
                    statusCode: 400,
                });
                return;
            }
            // get the recommendation from the recommendation ms
            const response = yield axios_1.default.get(`${config.endpoint}/${id}`, {
                timeout: config_constants_1.RECOMMENDER_MS_REQUEST_TIMEOUT,
                // Let all HTTP statuses resolve so we can handle non‑200 explicitly
                validateStatus: () => true,
            });
            // extract the response data from the recommendation ms
            const data = response.data;
            const similarIds = data[config.responseField] || [];
            if (!(data === null || data === void 0 ? void 0 : data.success) || !Array.isArray(similarIds) || similarIds.length < 1) {
                // send the response
                (0, handle_error_1.handleError)(res, {
                    message: `No similar ${config.mediaType}s found try again later`,
                });
                return;
            }
            // get the full data from  db
            const items = yield config.model
                .find({ _id: { $in: similarIds } })
                .lean()
                .exec();
            // send the response
            res.status(200).json({
                success: true,
                data: items,
            });
        }
        catch (error) {
            //handle unexpected error
            (0, handle_error_1.handleError)(res, { error: error });
        }
    });
}
