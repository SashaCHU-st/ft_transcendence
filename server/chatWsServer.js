import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { handleChatMessage, MAX_MESSAGE_LENGTH } from './services/chatMessages.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'kuku';


const clients = new Map(); // userId -> WebSocket

export function broadcastChatMessage(message) {
  const send = (ws) => {
    try {
      ws.send(JSON.stringify({ type: 'chat', message }));
    } catch (err) {
      console.error('Error sending chat message:', err.message);
    }
  };

  const fromWs = clients.get(message.sender_id);
  if (fromWs && fromWs.readyState === fromWs.OPEN) send(fromWs);
  const toWs = clients.get(message.receiver_id);
  if (toWs && toWs.readyState === toWs.OPEN && toWs !== fromWs)
    send(toWs);
}

export function initChatWsServer() {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    const queryIdx = req.url.indexOf('?');
    if (queryIdx !== -1) {
      const params = new URLSearchParams(req.url.slice(queryIdx));
      const idParam = params.get('user_id');
      const token = params.get('token');
      if (!token) {
        ws.close();
        return;
      }
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        const idFromToken = payload.id;
        const parsedId = idParam ? parseInt(idParam, 10) : undefined;
        if (parsedId && parsedId !== idFromToken) {
          ws.close();
          return;
        }
        ws.user_id = idFromToken;
        clients.set(ws.user_id, ws);
      } catch {
        ws.close();
        return;
      }
    } else {
      ws.close();
      return;
    }

    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }
      if (msg.type !== 'chat') return;
      const fromId = ws.user_id;
      const toId = parseInt(msg.toId, 10);
      const { error } = handleChatMessage(fromId, toId, msg.text);
      if (error) {
        return;
      }
    });

    ws.on('close', () => {
      if (ws.user_id) clients.delete(ws.user_id);
    });
  });

  return wss;
}
