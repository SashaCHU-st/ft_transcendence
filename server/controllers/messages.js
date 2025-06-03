import db from "../database/database.js";
import { handleChatMessage } from "../services/chatMessages.js";

export async function sendMessage(req, reply) {
  const { fromId, toId, text } = req.body;
  const result = handleChatMessage(fromId, toId, text);
  if (result.error) {
    return reply.code(result.status).send({ message: result.error });
  }
  return reply.code(result.status).send({ id: result.message.id });
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
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`
    );
    const rows = stmt.all(user1, user2, user2, user1);
    return reply.code(200).send({ messages: rows });
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    return reply.code(500).send({ message: "Failed to fetch messages" });
  }
}
