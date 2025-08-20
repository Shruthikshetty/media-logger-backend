"use strict";
/**
 * @file Middleware to handle validation using zod
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReq = void 0;
const handle_error_1 = require("../utils/handle-error");
/**
 * Middleware to check validation results and return errors if any
 */
const validateReq = (schema) => {
    // return a middleware
    return (req, res, next) => {
        // parse request body
        const result = schema.safeParse(req.body);
        // in case validations fail
        if (!result.success) {
            const { fieldErrors, formErrors } = result.error.flatten();
            // combine errors
            const combinedErrors = [
                ...Object.values(fieldErrors).flat(),
                ...formErrors,
            ];
            // get all the error's
            const errorMessage = Object.values(combinedErrors).flat().join(' | ');
            (0, handle_error_1.handleError)(res, {
                message: errorMessage,
                error: combinedErrors,
                statusCode: 400,
            });
            return;
        }
        // attach validated data
        // @ts-ignore
        req.validatedData = result.data;
        next();
    };
};
exports.validateReq = validateReq;
