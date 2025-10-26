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
exports.recordHistory = void 0;
const history_model_1 = __importDefault(require("../../models/history.model"));
const history_utils_1 = require("../utils/history-utils");
const logger_1 = require("../utils/logger");
const recordHistory = (entity, bulk = false) => {
    return (req, res) => {
        // track history once response is sent
        res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // only track success responses 2XX
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return;
            }
            // in case user is not logged in
            if (!req.userData) {
                return;
            }
            // get user id
            const { _id } = req.userData;
            // in case user id is not found
            if (!_id) {
                return;
            }
            const action = (0, history_utils_1.getHistoryMethod)(req.method);
            try {
                // create a new history
                const newHistory = new history_model_1.default({
                    action,
                    user: _id,
                    title: (0, history_utils_1.generateHistoryTitle)(action, entity, bulk),
                    oldValue: res === null || res === void 0 ? void 0 : res.oldValue,
                    newValue: res === null || res === void 0 ? void 0 : res.newValue,
                    entityType: entity,
                    entityId: (_a = res === null || res === void 0 ? void 0 : res.newValue) === null || _a === void 0 ? void 0 : _a._id, // no need to store old value id since they are invalid after deletion
                    bulk,
                });
                // save the history
                yield newHistory.save();
            }
            catch (error) {
                logger_1.logger.error(' failed to store history %s', error);
            }
        }));
    };
};
exports.recordHistory = recordHistory;
