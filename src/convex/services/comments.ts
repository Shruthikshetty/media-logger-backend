/**
 * @file contains all the convex queries and mutations for media comments
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { GET_ALL_MEDIA_COMMENTS_LIMITS } from '../../common/constants/config.constants';

/**
 * mutation to create a new media comment
 */
export const createMediaCommentMutation = mutation({
  args: {
    entityId: v.string(),
    entityType: v.string(),
    user: v.string(),
    comment: v.string(),
    username: v.optional(v.string()),
    profileImg: v.optional(v.string()),
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
export const getMediaCommentsQuery = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    // clip limit in the range
    let limit = args?.limit ?? GET_ALL_MEDIA_COMMENTS_LIMITS.limit.default;
    limit = Math.max(
      GET_ALL_MEDIA_COMMENTS_LIMITS.limit.min,
      Math.min(GET_ALL_MEDIA_COMMENTS_LIMITS.limit.max, limit)
    );
    return await ctx.db
      .query('mediaComments')
      .withIndex('by_entityType_and_entityId', (q) =>
        q.eq('entityType', args.entityType).eq('entityId', args.entityId)
      )
      .paginate({
        cursor: args?.cursor ?? null,
        numItems: limit,
      });
  },
});
