import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { sendMessage } from '../controllers/messages.js';

function createReply() {
  return {
    status: null,
    body: null,
    code(code) { this.status = code; return this; },
    send(payload) { this.body = payload; return this; }
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

test('sendMessage uses authenticated user id', async () => {
  const req = { body: { toId: 2, text: 'Hi', fromId: 999 }, user: { id: 1 } };
  const reply = createReply();
  await sendMessage(req, reply);
  assert.equal(reply.status, 201);
  const row = db.prepare('SELECT sender_id FROM messages WHERE id = ?').get(reply.body.id);
  assert.equal(row.sender_id, 1);
});

