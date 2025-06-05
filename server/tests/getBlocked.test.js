import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { block, getBlocked } from '../controllers/blocks.js';

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
  db.prepare("INSERT INTO users (id, username, email, name, password) VALUES (1,'u1','u1@ex','U1','pass'),(2,'u2','u2@ex','U2','pass'),(3,'u3','u3@ex','U3','pass')").run();
});

test('getBlocked returns array of ids after blocking users', async () => {
  const req1 = { body: { blockedId: 2 }, user: { id: 1 } };
  const reply1 = createReply();
  await block(req1, reply1);

  const req2 = { body: { blockedId: 3 }, user: { id: 1 } };
  const reply2 = createReply();
  await block(req2, reply2);

  const req = { user: { id: 1 } };
  const reply = createReply();
  await getBlocked(req, reply);

  assert.equal(reply.status, 200);
  assert.deepEqual(reply.body, { blocked: [2, 3] });
});
