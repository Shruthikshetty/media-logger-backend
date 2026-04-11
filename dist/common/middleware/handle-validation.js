"use strict";
/**
 * @file Middleware to handle validation using zod
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReq = void 0;
const validate_data_1 = require("../utils/validate-data");
/**
 * Middleware to check validation results and return errors if any
 */
const validateReq = (schema) => {
    // return a middleware
    return (req, res, next) => {
        //validate data
        const result = (0, validate_data_1.validateDataUsingZod)(schema, req.body, res);
        // in case validations fail
        if (!result)
            return;
        // attach validated data
        // @ts-ignore
        req.validatedData = result;
        next();
    };
};
exports.validateReq = validateReq;
