import { type FunctionReference } from "convex/server";
export declare const api: PublicApiType;
export declare const internal: InternalApiType;
export type PublicApiType = {
    services: {
        comments: {
            createMediaCommentMutation: FunctionReference<"mutation", "public", {
                comment: string;
                entityId: string;
                entityType: string;
                profileImg?: string;
                user: string;
                username?: string;
            }, any>;
            getMediaCommentsQuery: FunctionReference<"query", "public", {
                cursor?: string | null;
                entityId: string;
                entityType: string;
                limit?: number;
            }, any>;
        };
    };
};
export type InternalApiType = {};
