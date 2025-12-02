"use strict";
/**
 * this file contains all the controllers related to upload
 */
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
const uploadImage = async (req, res) => {
    try {
        //check if file exist
        if (!req.file) {
            (0, handle_error_1.handleError)(res, { message: 'No file uploaded', statusCode: 400 });
            return;
        }
        // Upload image to Cloudinary
        const result = await cloudinary_config_1.default.uploader.upload(req.file.path, {
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
        if (req.file?.path) {
            fs_1.default.unlink(req.file.path, (err) => {
                if (err) {
                    logger_1.logger.warn(`Failed to remove temp file: ${err?.message}`);
                }
            });
        }
    }
};
exports.uploadImage = uploadImage;
