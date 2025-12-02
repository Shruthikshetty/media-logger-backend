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
    };
  };
};
export type InternalApiType = {};
