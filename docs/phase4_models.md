# **Database Models**

The following is a description of the database models developed in the application phase 4

## Media Comments Model

This model represents user comments attached to a single media item (movie, tv show, game, etc.).

| Field      | Type   | Description                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------------- |
| entityId   | String | The ID of the media entity this comment belongs to. Required.                |
| entityType | String | The type of media entity (for example, Movie, Episode, Game etc ). Required. |
| user       | String | The ID of the user who created the comment. Required.                        |
| comment    | String | The text content of the comment. Required.                                   |
| username   | String | The display name of the user who created the comment. Optional.              |
| createdAt  | String | ISO-8601 timestamp representing when the comment was created. Required.      |
| updatedAt  | String | ISO-8601 timestamp representing when the comment was last updated. Required. |
| profileImg | String | URL to the user’s profile image associated with the comment. Optional.       |
