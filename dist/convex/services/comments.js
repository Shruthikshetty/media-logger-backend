"use strict";
/**
 * @file contains all the convex queries and mutations for media comments
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaCommentsQuery = exports.createMediaCommentMutation = void 0;
const server_1 = require("../_generated/server");
const values_1 = require("convex/values");
const config_constants_1 = require("../../common/constants/config.constants");
/**
 * mutation to create a new media comment
 */
exports.createMediaCommentMutation = (0, server_1.mutation)({
    args: {
        entityId: values_1.v.string(),
        entityType: values_1.v.string(),
        user: values_1.v.string(),
        comment: values_1.v.string(),
        username: values_1.v.optional(values_1.v.string()),
        profileImg: values_1.v.optional(values_1.v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        // create a new comment
        const newComment = {
            ...args,
            createdAt: now,
            updatedAt: now,
        };
        // Insert the new comment into the database
        return await ctx.db.insert('mediaComments', newComment);
    },
});
//query to get all media comments with pagination
exports.getMediaCommentsQuery = (0, server_1.query)({
    args: {
        entityType: values_1.v.string(),
        entityId: values_1.v.string(),
        limit: values_1.v.optional(values_1.v.number()),
        cursor: values_1.v.optional(values_1.v.union(values_1.v.string(), values_1.v.null())),
    },
    handler: async (ctx, args) => {
        // clip limit in the range
        let limit = args?.limit ?? config_constants_1.GET_ALL_MEDIA_COMMENTS_LIMITS.limit.default;
        limit = Math.max(config_constants_1.GET_ALL_MEDIA_COMMENTS_LIMITS.limit.min, Math.min(config_constants_1.GET_ALL_MEDIA_COMMENTS_LIMITS.limit.max, limit));
        return await ctx.db
            .query('mediaComments')
            .withIndex('by_entityType_and_entityId', (q) => q.eq('entityType', args.entityType).eq('entityId', args.entityId))
            .paginate({
            cursor: args?.cursor ?? null,
            numItems: limit,
        });
    },
});
