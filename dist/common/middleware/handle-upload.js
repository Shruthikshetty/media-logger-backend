"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = void 0;
const handle_error_1 = require("../utils/handle-error");
/**
 * A middleware to handle file upload using Multer.
 * handles any errors that may occur during the upload process.
 * @param uploader - The Multer instance used for file upload.
 * @param fieldName - The field name of the file in the request.
 * @param uploadType - The type of upload, either 'single' or 'array'.
 * @param maxCount - The maximum number of files to be uploaded. Only applicable for 'array' upload type.
 */
const handleUpload = (uploader, fieldName, uploadType = 'single', maxCount) => {
    return (req, res, next) => {
        // Determine which Multer method to call based on the upload type
        const uploadHandler = uploadType === 'single'
            ? uploader.single(fieldName)
            : uploader.array(fieldName, maxCount);
        uploadHandler(req, res, (err) => {
            if (err) {
                (0, handle_error_1.handleError)(res, {
                    message: `File upload error ${err.message}`,
                    statusCode: 400,
                });
                return;
            }
            // Call the next middleware if no errors
            next();
        });
    };
};
exports.handleUpload = handleUpload;
