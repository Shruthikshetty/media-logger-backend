# **Database Models**

The following is a description of the database models developed in the application phase 3

## History Model

This model represents the history of media addition, update, and deletion.

| Field      | Type     | Description                                                                  |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| user       | ObjectId | The user who performed the action. Reference to the `User` model. Required.  |
| entityType | String   | The type of entity involved in the action. Required. Enum: `HISTORY_ENTITY`. |
| entityId   | String   | The ID of the entity involved in the action. Optional.                       |
| action     | String   | The type of action performed. Required. Enum: `HISTORY_ACTION`.              |
| oldValue   | Mixed    | The previous value of the entity before the action. Optional.                |
| newValue   | Mixed    | The new value of the entity after the action. Optional.                      |
| title      | String   | The title or description of the action. Optional.                            |
| bulk       | Boolean  | Specify if the action performed was a bulk action                            |
