import { Response } from 'express';
import { EntityType } from '../middleware/record-history';

/**
 * Returns the history method based on the given HTTP method.
 * Returns 'Add' for POST, 'Update' for PUT and PATCH, Read for GET and 'Delete' for DELETE.
 * @param {string} method - The HTTP method to get the history method for.
 * @returns {string} - The history method based on the given HTTP method.
 */
export const getHistoryMethod = (method: string) => {
  switch (method) {
    case 'POST':
      return 'Add';
    case 'PUT':
    case 'PATCH':
      return 'Update';
    case 'DELETE':
      return 'Delete';
    default:
      return 'Read';
  }
};

//util to append the oldValue to the res body
export const appendOldDoc = (res: Response, oldValue: any) => {
  //@ts-ignore
  res.oldValue = oldValue;
};

//util to append the newValue to the res body
export const appendNewDoc = (res: Response, newValue: any) => {
  //@ts-ignore
  res.newValue = newValue;
};

//util to append both oldValue and newValue to the res body
export const appendOldAndNewDoc = ({
  res,
  oldValue,
  newValue,
}: {
  res: Response;
  oldValue: any;
  newValue: any;
}) => {
  //@ts-ignore
  res.oldValue = oldValue;
  //@ts-ignore
  res.newValue = newValue;
};

/**
 * Generates a human-readable title for a history log entry.
 * @param {ActionType} action - The action performed ('Add', 'Update', 'Delete').
 * @param {EntityType} entity - The type of entity being acted upon.
 * @returns {string} A descriptive title for the history log.
 */
export const generateHistoryTitle = (
  action: 'Add' | 'Update' | 'Delete' | 'Read', // read is included for type safety but its not handled currently
  entity: EntityType
): string => {
  // Use past tense for a more natural log entry
  const actionVerb = {
    Add: 'Added',
    Update: 'Updated',
    Delete: 'Deleted',
  }[action];

  // For 'Update' and 'Delete', we refer to an existing entity
  if (action === 'Update' || action === 'Delete') {
    // e.g., "Updated the Game", "Deleted the Episode"
    return `${actionVerb} the ${entity}`;
  }

  // For 'Add', we create a new entity. Using "a" or "an" makes it sound better.
  const article = ['Episode', 'User'].includes(entity) ? 'an' : 'a';
  // e.g., "Added a new Game", "Added a new Episode"
  return `${actionVerb} ${article} new ${entity}`;
};
