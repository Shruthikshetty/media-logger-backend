"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHistoryTitle = exports.appendOldAndNewDoc = exports.appendNewDoc = exports.appendOldDoc = exports.getHistoryMethod = void 0;
/**
 * Returns the history method based on the given HTTP method.
 * Returns 'Add' for POST, 'Update' for PUT and PATCH, Read for GET and 'Delete' for DELETE.
 * @param {string} method - The HTTP method to get the history method for.
 * @returns {string} - The history method based on the given HTTP method.
 */
const getHistoryMethod = (method) => {
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
exports.getHistoryMethod = getHistoryMethod;
//util to append the oldValue to the res body
const appendOldDoc = (res, oldValue) => {
    //@ts-ignore
    res.oldValue = oldValue;
};
exports.appendOldDoc = appendOldDoc;
//util to append the newValue to the res body
const appendNewDoc = (res, newValue) => {
    //@ts-ignore
    res.newValue = newValue;
};
exports.appendNewDoc = appendNewDoc;
//util to append both oldValue and newValue to the res body
const appendOldAndNewDoc = ({ res, oldValue, newValue, }) => {
    //@ts-ignore
    res.oldValue = oldValue;
    //@ts-ignore
    res.newValue = newValue;
};
exports.appendOldAndNewDoc = appendOldAndNewDoc;
/**
 * Generates a human-readable title for a history log entry.
 * @param {ActionType} action - The action performed ('Add', 'Update', 'Delete').
 * @param {EntityType} entity - The type of entity being acted upon.
 * @returns {string} A descriptive title for the history log.
 */
const generateHistoryTitle = (action, // read is included for type safety but its not handled currently
entity, bulk) => {
    // Use past tense for a more natural log entry
    const actionVerb = {
        Add: 'Added',
        Update: 'Updated',
        Delete: 'Deleted',
    }[action];
    // Handle bulk operations first
    if (bulk) {
        // Basic pluralization: add 's' if it doesn't already end with 's'.
        const pluralEntity = entity.endsWith('s') ? entity : `${entity}s`;
        return `${actionVerb} multiple ${pluralEntity}`;
    }
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
exports.generateHistoryTitle = generateHistoryTitle;
