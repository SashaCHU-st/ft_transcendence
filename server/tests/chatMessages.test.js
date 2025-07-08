import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { handleChatMessage } from '../services/chatMessages.js';
import { getMessages } from '../controllers/messages.js';
import { MAX_MESSAGE_LENGTH } from '../../shared/chatConstants.js';
import { blockUser, unblockUser, isBlocked } from '../services/blocks.js';
import HttpError from '../utils/http-error.js';

function createReply() {
  return {
    status: null,
    body: null,
    code(code) {
      this.status = code;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
}

test.beforeEach(() => {
  db.exec('DELETE FROM messages');
  db.exec('DELETE FROM blocks');
  db.exec('DELETE FROM favorites');
  db.exec('DELETE FROM challenge');
  db.exec('DELETE FROM users');
  db.prepare("INSERT INTO users (id, username, email, name, password) VALUES (1,'u1','u1@ex','U1','pass'),(2,'u2','u2@ex','U2','pass')").run();
});

test('handleChatMessage inserts valid message', () => {
  const message = handleChatMessage(1, 2, 'Hello');
  assert.ok(message.id);
  const row = db
    .prepare('SELECT text, blocked FROM messages WHERE id = ?')
    .get(message.id);
  assert.equal(row.text, 'Hello');
  assert.equal(row.blocked, 0);
});

test('handleChatMessage throws for missing parameters', () => {
  assert.throws(() => handleChatMessage(undefined, 2, 'Hello'), HttpError);
});

test('handleChatMessage rejects too long message', () => {
  const longText = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
  assert.throws(() => handleChatMessage(1, 2, longText), HttpError);
});

test('blocked users messages are not delivered', () => {
  blockUser(1, 2);
  const message = handleChatMessage(2, 1, 'Hi');
  assert.ok(message.id);
  const row = db
    .prepare('SELECT receiver_id, blocked FROM messages WHERE id = ?')
    .get(message.id);
  assert.equal(row.receiver_id, 1);
  assert.equal(row.blocked, 1);
});

test('blockUser rejects invalid blockerId', () => {
  assert.throws(
    () => blockUser(999, 1),
    (err) => err instanceof HttpError && err.code === 404
  );
});

test('unblocking allows sending messages again', () => {
  blockUser(1, 2);
  unblockUser(1, 2);
  const message = handleChatMessage(2, 1, 'Hi again');
  assert.ok(message.id);
  const row = db
    .prepare('SELECT blocked FROM messages WHERE id = ?')
    .get(message.id);
  assert.equal(row.blocked, 0);
});

test('isBlocked reflects current block state', () => {
  assert.equal(isBlocked(1, 2), false);
  assert.equal(isBlocked(2, 1), false);
  blockUser(1, 2);
  assert.equal(isBlocked(1, 2), true);
  assert.equal(isBlocked(2, 1), true);
  unblockUser(1, 2);
  assert.equal(isBlocked(1, 2), false);
  assert.equal(isBlocked(2, 1), false);
});

test('messages sent while blocked are not returned', async () => {
  blockUser(1, 2);
  handleChatMessage(2, 1, 'Blocked text');
  unblockUser(1, 2);
  handleChatMessage(2, 1, 'Visible');

  const req = { query: { user1: 1, user2: 2 } };
  const reply = createReply();
  await getMessages(req, reply);

  assert.equal(reply.status, 200);
  assert.equal(reply.body.messages.length, 1);
  assert.equal(reply.body.messages[0].text, 'Visible');
});
