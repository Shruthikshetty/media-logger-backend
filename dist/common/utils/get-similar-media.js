"use strict";
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
async function getSimilarMedia(req, res, config) {
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
        const headers = {};
        if (req.id) {
            headers['X-Request-Id'] = req.id;
        }
        const response = await axios_1.default.get(`${config.endpoint}/${id}`, {
            timeout: config_constants_1.RECOMMENDER_MS_REQUEST_TIMEOUT,
            headers,
            // Let all HTTP statuses resolve so we can handle non‑200 explicitly
            validateStatus: () => true,
        });
        // extract the response data from the recommendation ms
        const data = response.data;
        const similarIds = data[config.responseField] || [];
        if (!data?.success || !Array.isArray(similarIds) || similarIds.length < 1) {
            // send the response
            (0, handle_error_1.handleError)(res, {
                message: `No similar ${config.mediaType}s found try again later`,
            });
            return;
        }
        // get the full data from  db
        const items = await config.model
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
}
