/**
 * Chat constants and shared JSDoc type declarations used by both the server
 * and client. The accompanying `chatConstants.d.ts` file provides the
 * TypeScript interface for editors.
 */

/**
 * @typedef {object} SystemNotification
 * @property {string} id
 * @property {'waiting' | 'info'} type
 * @property {string} text
 */

export const MAX_MESSAGE_LENGTH = 500;
// How long system notifications remain active before being removed
export const SYSTEM_MESSAGE_TTL_MS = 60_000;
// Maximum number of system notifications to keep in state
export const MAX_SYSTEM_MESSAGES = 10;
