# **Database Models**

The following is a description of the database models developed in the application phase 5

# Media entry model

This model contains user entries for the respective media item movie , game and tv show

| Field     | Type   | Description                                                                                                   |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| user      | String | The ID of the user who owns this entry. Required. Refers to the User model .                                  |
| mediaItem | String | The ID of the specific media item (Movie, Game, etc.) being tracked. Required .                               |
| onModel   | String | The type of the media entity (e.g., 'Movie', 'Game'). Used for dynamic referencing. Required .                |
| status    | String | The current status of the entry (e.g., 'Watching', 'Completed'). restricted to MEDIA_ENTRY_STATUS. Required . |
| rating    | Number | The user's rating for the media item, ranging from 0 to 10. Optional .                                        |
| createdAt | String | ISO-8601 timestamp representing when the entry was created. Required .                                        |
| updatedAt | String | ISO-8601 timestamp representing when the entry was last updated. Required .                                   |
