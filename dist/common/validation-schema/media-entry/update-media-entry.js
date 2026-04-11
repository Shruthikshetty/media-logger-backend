"use strict";
/**
 * @file contains the validation schema for updating media entry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMediaEntrySchema = void 0;
const zod_1 = require("zod");
const model_constants_1 = require("../../constants/model.constants");
//schema
exports.UpdateMediaEntrySchema = zod_1.z
    .object({
    status: zod_1.z
        .string({
        message: 'Status must be string',
    })
        .refine((val) => model_constants_1.MEDIA_ENTRY_STATUS.includes(val), {
        message: `Status must be one of the following: ${model_constants_1.MEDIA_ENTRY_STATUS.join(', ')}`,
    })
        .optional(),
    rating: zod_1.z
        .number({
        message: 'Rating must be number',
    })
        .min(0, 'Rating cannot be negative')
        .max(10, 'Rating cannot be greater than 10')
        .optional(),
})
    .superRefine((data, ctx) => {
    const hasValue = Object.values(data).some((val) => val !== undefined);
    if (!hasValue) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'At least one field must be updated',
            path: [],
        });
    }
});
