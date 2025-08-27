"use strict";
/**
 * this file contains all the controllers related to upload
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_config_1 = __importDefault(require("../common/config/cloudinary.config"));
const config_constants_1 = require("../common/constants/config.constants");
const handle_error_1 = require("../common/utils/handle-error");
const logger_1 = require("../common/utils/logger");
const fs_1 = __importDefault(require("fs"));
//controller used to upload image to cdn
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //check if file exist
        if (!req.file) {
            (0, handle_error_1.handleError)(res, { message: 'No file uploaded', statusCode: 400 });
            return;
        }
        // Upload image to Cloudinary
        const result = yield cloudinary_config_1.default.uploader.upload(req.file.path, {
            folder: config_constants_1.CLOUDINARY_FOLDER,
            use_filename: true,
        });
        // Return the uploaded image URL
        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
            },
            message: 'Image uploaded successfully',
        });
    }
    catch (err) {
        //catch any unexpected error
        (0, handle_error_1.handleError)(res, {
            error: err,
        });
    }
    finally {
        //remove the local file
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            fs_1.default.unlink(req.file.path, (err) => {
                if (err) {
                    logger_1.logger.warn(`Failed to remove temp file: ${err === null || err === void 0 ? void 0 : err.message}`);
                }
            });
        }
    }
});
exports.uploadImage = uploadImage;
