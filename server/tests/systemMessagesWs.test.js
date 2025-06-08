import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { once } from 'node:events';
import {
  initChatWsServer,
  broadcastSystemMessage,
  activeSystemMessages,
} from '../chatWsServer.js';
import { SYSTEM_MESSAGE_TTL_MS } from '../../shared/chatConstants.js';
import { ChatMessageTypes } from '../../shared/chatMessageTypes.js';

const JWT_SECRET = 'kuku';

function createServer() {
  const wss = initChatWsServer();
  const server = http.createServer();
  server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
  return { wss, server };
}

test.beforeEach(() => {
  activeSystemMessages.clear();
});

test('broadcastSystemMessage reaches connected clients and expires', async (t) => {
  const { wss, server } = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  t.after(() => {
    server.close();
    wss.close();
  });

  const token = jwt.sign({ id: 1 }, JWT_SECRET);
  const ws = new WebSocket(`ws://localhost:${port}/chat?token=${token}`);
  await once(ws, 'open');


  t.mock.timers.enable({ apis: ['setTimeout'] });

  const msg = { id: 'note1', type: 'info', text: 'hello' };
  const firstP = once(ws, 'message');
  broadcastSystemMessage(msg);
  const [first] = await firstP;
  assert.deepEqual(JSON.parse(first.toString()), { type: ChatMessageTypes.SYSTEM, message: msg });

  const removeP = once(ws, 'message');
  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS + 1);
  assert.equal(activeSystemMessages.has('note1'), false);
  const [remove] = await removeP;
  assert.deepEqual(JSON.parse(remove.toString()), { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'note1' });

  t.mock.timers.reset();
  ws.close();
});
