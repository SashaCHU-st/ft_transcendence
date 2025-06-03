import db from '../database/database.js';
import { broadcastChatMessage } from '../chatWsServer.js';

export const MAX_MESSAGE_LENGTH = 500;

/**
 * Validate, store and broadcast a chat message.
 * @param {number} fromId
 * @param {number} toId
 * @param {string} text
 * @returns {{ message?: object, error?: string, status: number }}
 */
export function handleChatMessage(fromId, toId, text) {
  const cleanText = text?.trim();
  if (!fromId || !toId || !cleanText) {
    return { error: 'Missing parameters', status: 400 };
  }

  if (cleanText.length > MAX_MESSAGE_LENGTH) {
    console.warn(`Message from ${fromId} exceeds max length: ${cleanText.length}`);
    return { error: 'Message too long', status: 400 };
  }

  if (/[<>]/.test(cleanText)) {
    console.warn(`Suspicious chat message from ${fromId} to ${toId}: ${cleanText}`);
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO messages (sender_id, receiver_id, text) VALUES (?, ?, ?)'
    );
    const result = stmt.run(fromId, toId, cleanText);
    const message = {
      id: result.lastInsertRowid,
      sender_id: fromId,
      receiver_id: toId,
      text: cleanText,
      created_at: new Date().toISOString(),
    };
    broadcastChatMessage(message);
    return { message, status: 201 };
  } catch (err) {
    console.error('Error handling chat message:', err.message);
    return { error: 'Failed to send message', status: 500 };
  }
}
