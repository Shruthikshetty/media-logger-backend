"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDataUsingZod = void 0;
const handle_error_1 = require("./handle-error");
/**
 * Validates data against a Zod schema.
 * If validation fails, it automatically sends a 400 response and returns undefined.
 * If validation succeeds, it returns the parsed data.
 */
const validateDataUsingZod = (schema, data, res) => {
    const result = schema.safeParse(data);
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
        //send the response
        (0, handle_error_1.handleError)(res, {
            message: errorMessage,
            error: combinedErrors,
            statusCode: 400,
        });
        // return  undefined if fails
        return undefined;
    }
    // attach validated data
    return result.data;
};
exports.validateDataUsingZod = validateDataUsingZod;
