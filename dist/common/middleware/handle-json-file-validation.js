"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateJsonFile = void 0;
const handle_error_1 = require("../utils/handle-error");
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("../utils/logger");
//function to delete file
const unlinkFile = (filePath) => {
    try {
        fs_1.default.unlinkSync(filePath);
    }
    catch (err) {
        (0, logger_1.devLogger)(JSON.stringify(err, null, 2));
    }
};
/**
 * This middleware validates a JSON file uploaded by Multer using Zod.
 * The middleware assumes that the file is located in the 'file' property of the request object.(hence call multer middleware first)
 * If the validation fails, the middleware will return an error response with the validation errors.
 * If the validation succeeds, the middleware will attach the validated data to the 'validatedData' property of the request object.
 * @param schema The Zod schema to validate the JSON file with.
 * @returns A middleware function that validates the JSON file and attaches the validated data to the request object.
 */
const ValidateJsonFile = (schema) => {
    return (req, res, next) => {
        //Check if a file was uploaded by Multer
        if (!req.file) {
            (0, handle_error_1.handleError)(res, {
                message: 'No file uploaded. Please upload a JSON file.',
                statusCode: 400,
            });
            return;
        }
        // extract the file path
        const filePath = req.file.path;
        try {
            // Read the file content asynchronously
            const fileContent = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
            const jsonData = JSON.parse(fileContent);
            // parse request body
            const result = schema.safeParse(jsonData);
            // in case validations fail
            if (!result.success) {
                // Flatten errors
                const { fieldErrors, formErrors } = result.error.flatten();
                // combine errors
                const allErrors = [...Object.values(fieldErrors).flat(), ...formErrors];
                // Filter deduplicate error messages using a Set
                const uniqueErrors = [...new Set(allErrors)];
                // get all the error's
                const errorMessage = Object.values(uniqueErrors).flat().join(' | ');
                unlinkFile(filePath);
                (0, handle_error_1.handleError)(res, { message: errorMessage, error: uniqueErrors });
                return;
            }
            // attach validated data
            // @ts-ignore
            req.validatedData = result.data;
            unlinkFile(filePath);
            next();
        }
        catch (err) {
            unlinkFile(filePath);
            // handle unexpected error
            (0, handle_error_1.handleError)(res, {
                error: err,
            });
        }
    };
};
exports.ValidateJsonFile = ValidateJsonFile;
