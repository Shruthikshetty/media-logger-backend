"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file contain all the convex schemas .
 */
const server_1 = require("convex/server");
const values_1 = require("convex/values");
// media schema
exports.default = (0, server_1.defineSchema)({
    // media comments schema
    mediaComments: (0, server_1.defineTable)({
        entityId: values_1.v.string(),
        entityType: values_1.v.string(),
        user: values_1.v.string(), // user id
        comment: values_1.v.string(),
        username: values_1.v.optional(values_1.v.string()),
        createdAt: values_1.v.string(), //iso
        updatedAt: values_1.v.string(), //iso
        profileImg: values_1.v.optional(values_1.v.string()),
    }).index('by_entityType_and_entityId', [
        'entityType',
        'entityId',
        'createdAt',
    ]),
});
