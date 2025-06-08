import { WebSocketServer, WebSocket } from 'ws';
import { handleChatMessage } from './services/chatMessages.js';
import HttpError from './utils/http-error.js';
import wsAuth from './utils/wsAuth.js';
import { SYSTEM_MESSAGE_TTL_MS, MAX_SYSTEM_MESSAGES } from '../shared/chatConstants.js';
import { ChatMessageTypes } from '../shared/chatMessageTypes.js';

/**
 * @typedef {object} SystemNotification
 * @property {string} id
 * @property {'waiting' | 'info'} type
 * @property {string} text
 */


// Map of userId -> Set of WebSocket connections
export const clients = new Map();
// Active system notifications that should be sent to newly connected clients
// Map of id -> { message, timeout }
export const activeSystemMessages = new Map();

function broadcastPayload(payload, target = null) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const send = (ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(data);
      } catch (err) {
        console.error('Error broadcasting payload:', err.message);
      }
    }
  };

  if (target) {
    if (target instanceof Set) {
      for (const ws of target) send(ws);
    } else {
      send(target);
    }
    return;
  }

  for (const set of clients.values()) {
    for (const ws of set) {
      send(ws);
    }
  }
}

function removeSystemMessage(id) {
  const info = activeSystemMessages.get(id);
  if (info?.timeout) clearTimeout(info.timeout);
  activeSystemMessages.delete(id);
  broadcastPayload({ type: ChatMessageTypes.SYSTEM_REMOVE, id });
}

/**
 * Broadcast a system notification to all connected clients and store it so
 * newly connected clients receive it as well.
 *
 * @param {SystemNotification} message - Notification to broadcast.
 * @param {{ remove?: boolean }} [options]
 */
export function broadcastSystemMessage(message, { remove = false } = {}) {
  if (remove) {
    removeSystemMessage(message.id);
    return;
  } else {
    if (!activeSystemMessages.has(message.id) &&
        activeSystemMessages.size >= MAX_SYSTEM_MESSAGES) {
      const oldestId = activeSystemMessages.keys().next().value;
      if (oldestId) removeSystemMessage(oldestId);
    }
    const existing = activeSystemMessages.get(message.id);
    if (existing?.timeout) clearTimeout(existing.timeout);
    const timeout = setTimeout(
      () => removeSystemMessage(message.id),
      SYSTEM_MESSAGE_TTL_MS,
    );
    activeSystemMessages.set(message.id, { message, timeout });
    broadcastPayload({ type: ChatMessageTypes.SYSTEM, message });
  }
}

function sendActiveSystemMessages(ws) {
  for (const [, info] of activeSystemMessages) {
    broadcastPayload(
      { type: ChatMessageTypes.SYSTEM, message: info.message },
      ws,
    );
  }
}

export function broadcastChatMessage(message, { toReceiver = true } = {}) {
  const send = (ws) => {
    try {
      ws.send(
        JSON.stringify({ type: ChatMessageTypes.CHAT, message }),
      );
    } catch (err) {
      console.error('Error sending chat message:', err.message);
    }
  };

  const recipients = new Set();
  const fromSet = clients.get(message.sender_id);
  if (fromSet) {
    for (const ws of fromSet) recipients.add(ws);
  }

  if (toReceiver) {
    const toSet = clients.get(message.receiver_id);
    if (toSet) {
      for (const ws of toSet) recipients.add(ws);
    }
  }

  for (const ws of recipients) {
    if (ws.readyState === WebSocket.OPEN) send(ws);
  }
}

export function initChatWsServer() {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    const info = wsAuth(req, { requireToken: true });
    if (!info) {
      ws.close();
      return;
    }
    ws.user_id = info.userId;
    if (info.username) ws.username = info.username;
    let set = clients.get(ws.user_id);
    if (!set) {
      set = new Set();
      clients.set(ws.user_id, set);
    }
    set.add(ws);
    sendActiveSystemMessages(ws);

    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }
      if (msg.type !== ChatMessageTypes.CHAT) return;
      const fromId = ws.user_id;
      const toId = parseInt(msg.toId, 10);
      try {
        handleChatMessage(fromId, toId, msg.text);
      } catch (err) {
        const code = err instanceof HttpError ? err.code : 500;
        const message = err instanceof Error ? err.message : 'Unknown error';
        try {
          ws.send(
            JSON.stringify({
              type: ChatMessageTypes.ERROR,
              code,
              message,
            }),
          );
        } catch (sendErr) {
          console.error('Error sending ws error:', sendErr.message);
        }
        return;
      }
    });

    ws.on('close', () => {
      if (!ws.user_id) return;
      const set = clients.get(ws.user_id);
      if (!set) return;
      set.delete(ws);
      if (set.size === 0) clients.delete(ws.user_id);
    });
  });

  return wss;
}
