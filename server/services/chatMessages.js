import db from '../database/database.js';
import { broadcastChatMessage } from '../chatWsServer.js';
import { isBlocked } from './blocks.js';
import HttpError from '../utils/http-error.js';
import { MAX_MESSAGE_LENGTH } from '../../shared/chatConstants.js';
export { MAX_MESSAGE_LENGTH };

/**
 * Validate, store and broadcast a chat message.
 * @param {number} fromId
 * @param {number} toId
 * @param {string} text
 * @returns {object} The stored message
 */
export function handleChatMessage(fromId, toId, text) {
  const cleanText = text?.trim();
  if (!fromId || !toId || !cleanText) {
    throw new HttpError('Missing parameters', 400);
  }

  const blocked = isBlocked(fromId, toId);

  if (cleanText.length > MAX_MESSAGE_LENGTH) {
    console.warn(`Message from ${fromId} exceeds max length: ${cleanText.length}`);
    throw new HttpError('Message too long', 400);
  }

  if (/[<>]/.test(cleanText)) {
    console.warn(`Suspicious chat message from ${fromId} to ${toId}: ${cleanText}`);
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO messages (sender_id, receiver_id, text, blocked) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(fromId, toId, cleanText, blocked ? 1 : 0);
    const message = {
      id: result.lastInsertRowid,
      sender_id: fromId,
      receiver_id: toId,
      text: cleanText,
      blocked: blocked ? 1 : 0,
      created_at: new Date().toISOString(),
    };
    broadcastChatMessage(message, { toReceiver: !blocked });
    return message;
  } catch (err) {
    console.error('Error handling chat message:', err.message);
    throw new HttpError('Failed to send message', 500);
  }
}
