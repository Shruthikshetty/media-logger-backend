"use strict";
/**
 * @file contains the validation schema used in getting user media entries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleMediaByIdSchema = exports.GetAllUserMediaEntrySchema = void 0;
const zod_1 = require("zod");
const model_constants_1 = require("../../constants/model.constants");
const mongo_errors_1 = require("../../utils/mongo-errors");
//schema (this only contains optional fields )
exports.GetAllUserMediaEntrySchema = zod_1.z.object({
    onModel: zod_1.z
        .string()
        .refine((val) => model_constants_1.MEDIA_ENTRY_MODELS.includes(val))
        .optional(),
    status: zod_1.z
        .string()
        .refine((val) => model_constants_1.MEDIA_ENTRY_STATUS.includes(val))
        .optional(),
});
//schema to get a single media by using the model and media id
exports.GetSingleMediaByIdSchema = zod_1.z.object({
    mediaItem: zod_1.z.string().refine((val) => (0, mongo_errors_1.isMongoIdValid)(val)),
    onModel: zod_1.z
        .string()
        .refine((val) => model_constants_1.MEDIA_ENTRY_MODELS.includes(val))
        .optional(),
});
