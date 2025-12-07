import { type FunctionReference, anyApi } from 'convex/server';
import { type GenericId as Id } from 'convex/values';

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  services: {
    comments: {
      createMediaCommentMutation: FunctionReference<
        'mutation',
        'public',
        {
          comment: string;
          entityId: string;
          entityType: string;
          profileImg?: string;
          user: string;
          username?: string;
        },
        any
      >;
      deleteMediaCommentById: FunctionReference<
        'mutation',
        'public',
        { id: Id<'mediaComments'> },
        any
      >;
      getMediaCommentById: FunctionReference<
        'query',
        'public',
        { id: Id<'mediaComments'> },
        any
      >;
      getMediaCommentsQuery: FunctionReference<
        'query',
        'public',
        {
          cursor?: string | null;
          entityId: string;
          entityType: string;
          limit?: number;
        },
        any
      >;
      updateMediaCommentById: FunctionReference<
        'mutation',
        'public',
        { comment: string; id: Id<'mediaComments'> },
        any
      >;
    };
  };
};
export type InternalApiType = {};
