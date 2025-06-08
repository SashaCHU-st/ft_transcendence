import test from 'node:test';
import assert from 'node:assert/strict';
import { broadcastSystemMessage, clients, activeSystemMessages } from '../chatWsServer.js';
import { SYSTEM_MESSAGE_TTL_MS, MAX_SYSTEM_MESSAGES } from '../../shared/chatConstants.js';
import { ChatMessageTypes } from '../../shared/chatMessageTypes.js';

function createWs() {
  return {
    OPEN: 1,
    readyState: 1,
    sent: [],
    send(data) {
      this.sent.push(typeof data === 'string' ? JSON.parse(data) : data);
    },
  };
}

test.beforeEach(() => {
  clients.clear();
  activeSystemMessages.clear();
});

test('broadcastSystemMessage expires and emits removal', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const ws = createWs();
  clients.set(1, new Set([ws]));
  const msg = { id: 'm1', type: 'info', text: 'hello' };

  broadcastSystemMessage(msg);
  assert.ok(activeSystemMessages.has('m1'));
  assert.deepEqual(ws.sent[0], { type: ChatMessageTypes.SYSTEM, message: msg });

  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS + 1);

  assert.equal(activeSystemMessages.has('m1'), false);
  assert.deepEqual(ws.sent[1], { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'm1' });
  t.mock.timers.reset();
});

test('multiple system messages expire independently', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const ws = createWs();
  clients.set(1, new Set([ws]));
  const msg1 = { id: 'a', type: 'info', text: 'one' };
  const msg2 = { id: 'b', type: 'info', text: 'two' };

  broadcastSystemMessage(msg1);
  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2);
  broadcastSystemMessage(msg2);

  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2 + 1);
  assert.equal(activeSystemMessages.has('a'), false);
  assert.equal(activeSystemMessages.has('b'), true);

  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2 + 1);
  assert.equal(activeSystemMessages.has('b'), false);

  const payloads = ws.sent;
  assert.deepEqual(payloads[0], { type: ChatMessageTypes.SYSTEM, message: msg1 });
  assert.deepEqual(payloads[1], { type: ChatMessageTypes.SYSTEM, message: msg2 });
  assert.deepEqual(payloads[2], { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'a' });
  assert.deepEqual(payloads[3], { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'b' });
  t.mock.timers.reset();
});

test('broadcastSystemMessage refreshes TTL when re-sent', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const ws = createWs();
  clients.set(1, new Set([ws]));
  const msg = { id: 'r', type: 'info', text: 'refresh' };

  broadcastSystemMessage(msg);
  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2);
  broadcastSystemMessage(msg);

  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2 + 1);
  assert.equal(activeSystemMessages.has('r'), true);

  t.mock.timers.tick(SYSTEM_MESSAGE_TTL_MS / 2);
  assert.equal(activeSystemMessages.has('r'), false);

  const payloads = ws.sent;
  assert.deepEqual(payloads[0], { type: ChatMessageTypes.SYSTEM, message: msg });
  assert.deepEqual(payloads[1], { type: ChatMessageTypes.SYSTEM, message: msg });
  assert.deepEqual(payloads[2], { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'r' });
  t.mock.timers.reset();
});

test('removing non-existent system message still broadcasts', () => {
  const ws = createWs();
  clients.set(1, new Set([ws]));
  const msg = { id: 'ghost', type: 'info' };

  broadcastSystemMessage(msg, { remove: true });

  assert.equal(activeSystemMessages.has('ghost'), false);
  assert.deepEqual(ws.sent[0], { type: ChatMessageTypes.SYSTEM_REMOVE, id: 'ghost' });
});

test('excess system messages trim the oldest', () => {
  const ws = createWs();
  clients.set(1, new Set([ws]));
  for (let i = 0; i < MAX_SYSTEM_MESSAGES; i++) {
    const msg = { id: String(i), type: 'info', text: 'm' + i };
    broadcastSystemMessage(msg);
  }
  const extra = { id: 'x', type: 'info', text: 'extra' };
  broadcastSystemMessage(extra);

  assert.equal(activeSystemMessages.size, MAX_SYSTEM_MESSAGES);
  assert.equal(activeSystemMessages.has('0'), false);

  const payloads = ws.sent;
  const lastIndex = payloads.length - 1;
  assert.deepEqual(payloads[lastIndex - 1], { type: ChatMessageTypes.SYSTEM_REMOVE, id: '0' });
  assert.deepEqual(payloads[lastIndex], { type: ChatMessageTypes.SYSTEM, message: extra });
});
