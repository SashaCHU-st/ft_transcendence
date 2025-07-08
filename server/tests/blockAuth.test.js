import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { block, unblock, getBlocked } from '../controllers/blocks.js';

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

test('block uses authenticated user id', async () => {
  const req = { body: { blockedId: 1 }, user: { id: 2 } };
  const reply = createReply();
  await block(req, reply);
  // blocking for the first time should return HTTP 201
  assert.equal(reply.status, 201);
  const row = db
    .prepare('SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?')
    .get(2, 1);
  assert.ok(row);
});

test('block returns 201 on new block', async () => {
  const req = { body: { blockerId: 1, blockedId: 2 }, user: { id: 1 } };
  const reply = createReply();
  await block(req, reply);
  assert.equal(reply.status, 201);
});

test('block returns 200 if already blocked', async () => {
  const req = { body: { blockerId: 1, blockedId: 2 }, user: { id: 1 } };
  const reply1 = createReply();
  await block(req, reply1);
  const reply2 = createReply();
  await block(req, reply2);
  assert.equal(reply2.status, 200);
});

test('block returns 404 when target user does not exist', async () => {
  const req = { body: { blockedId: 999 }, user: { id: 1 } };
  const reply = createReply();
  await block(req, reply);
  assert.equal(reply.status, 404);
});

test('unblock returns 404 when no block', async () => {
  const req = { body: { blockerId: 1, blockedId: 2 }, user: { id: 1 } };
  const reply = createReply();
  await unblock(req, reply);
  assert.equal(reply.status, 404);
});

test('unblock returns 404 when target user does not exist', async () => {
  const req = { body: { blockedId: 999 }, user: { id: 1 } };
  const reply = createReply();
  await unblock(req, reply);
  assert.equal(reply.status, 404);
});

test('block returns 400 on missing blockedId', async () => {
  const req = { body: {}, user: { id: 1 } };
  const reply = createReply();
  await block(req, reply);
  assert.equal(reply.status, 400);
});

test('block returns 400 when blocking yourself', async () => {
  const req = { body: { blockedId: 1 }, user: { id: 1 } };
  const reply = createReply();
  await block(req, reply);
  assert.equal(reply.status, 400);
});

test('unblock returns 400 on missing blockedId', async () => {
  const req = { body: {}, user: { id: 1 } };
  const reply = createReply();
  await unblock(req, reply);
  assert.equal(reply.status, 400);
});

test('unblock returns 200 when block removed', async () => {
  const reqBlock = { body: { blockedId: 2 }, user: { id: 1 } };
  await block(reqBlock, createReply());
  const reply = createReply();
  await unblock(reqBlock, reply);
  assert.equal(reply.status, 200);
});

test('getBlocked lists ids for authenticated user', async () => {
  const reqBlock = { body: { blockedId: 2 }, user: { id: 1 } };
  await block(reqBlock, createReply());
  const reply = createReply();
  await getBlocked({ user: { id: 1 } }, reply);
  assert.deepEqual(reply.body, { blocked: [2] });
});
