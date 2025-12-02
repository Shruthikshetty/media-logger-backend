/**
 * @file contain all the convex schemas .
 */
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// media schema
export default defineSchema({
  // media comments schema
  mediaComments: defineTable({
    entityId: v.string(),
    entityType: v.string(),
    user: v.string(), // user id
    comment: v.string(),
    username: v.optional(v.string()),
    createdAt: v.string(), //iso
    updatedAt: v.string(), //iso
    profileImg: v.optional(v.string()),
  }).index('by_entityType_and_entityId', [
    'entityType',
    'entityId',
    'createdAt',
  ]),
});
