import db from '../database/database.js';
import { handleChatMessage } from '../services/chatMessages.js';
import HttpError from '../utils/http-error.js';

export async function sendMessage(req, reply) {
  const { toId, text } = req.body;
  const fromId = req.user?.id;
  try {
    const message = handleChatMessage(fromId, toId, text);
    return reply.code(201).send({ id: message.id });
  } catch (err) {
    if (err instanceof HttpError) {
      return reply.code(err.code).send({ message: err.message });
    }
    console.error('Unexpected error handling chat message:', err.message);
    return reply.code(500).send({ message: 'Failed to send message' });
  }
}

export async function getMessages(req, reply) {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    return reply.code(400).send({ message: "Missing parameters" });
  }
  try {
    const stmt = db.prepare(
      `SELECT id, sender_id, receiver_id, text, created_at
       FROM messages
       WHERE blocked = 0
         AND ((sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?))
       ORDER BY created_at ASC`
    );
    const rows = stmt.all(user1, user2, user2, user1);
    return reply.code(200).send({ messages: rows });
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    return reply.code(500).send({ message: "Failed to fetch messages" });
  }
}
