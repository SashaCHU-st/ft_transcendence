import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { blockUser, unblockUser, listBlockedUsers } from '../services/blocks.js';
import HttpError from '../utils/http-error.js';

test.beforeEach(() => {
  db.exec('DELETE FROM messages');
  db.exec('DELETE FROM blocks');
  db.exec('DELETE FROM favorites');
  db.exec('DELETE FROM challenge');
  db.exec('DELETE FROM users');
  db.prepare("INSERT INTO users (id, username, email, name, password) VALUES (1,'u1','u1@ex','U1','pass'),(2,'u2','u2@ex','U2','pass')").run();
});

test('listBlockedUsers returns ids', () => {
  blockUser(1, 2);
  const result = listBlockedUsers(1);
  assert.deepEqual(result, [2]);
});

test('listBlockedUsers throws on missing parameters', () => {
  assert.throws(
    () => listBlockedUsers(),
    (err) => err instanceof HttpError && err.code === 400
  );
});

test('blockUser returns boolean reflecting creation', () => {
  const first = blockUser(1, 2);
  const second = blockUser(1, 2);
  assert.equal(first, true);
  assert.equal(second, false);
});

test('blockUser throws on missing parameters', () => {
  assert.throws(
    () => blockUser(undefined, 2),
    (err) => err instanceof HttpError && err.code === 400
  );
});

test('blockUser prevents blocking yourself', () => {
  assert.throws(
    () => blockUser(1, 1),
    (err) => err instanceof HttpError && err.code === 400
  );
});

test('blockUser throws 404 when target user missing', () => {
  assert.throws(
    () => blockUser(1, 999),
    (err) => err instanceof HttpError && err.code === 404
  );
});

test('blockUser throws 404 when blocker user missing', () => {
  assert.throws(
    () => blockUser(999, 1),
    (err) => err instanceof HttpError && err.code === 404
  );
});

test('unblockUser returns false when nothing removed', () => {
  const result = unblockUser(1, 2);
  assert.equal(result, false);
});

test('unblockUser throws 404 when target user missing', () => {
  assert.throws(
    () => unblockUser(1, 999),
    (err) => err instanceof HttpError && err.code === 404
  );
});

test('unblockUser throws 404 when blocker user missing', () => {
  assert.throws(
    () => unblockUser(999, 1),
    (err) => err instanceof HttpError && err.code === 404
  );
});

test('unblockUser returns true when block removed', () => {
  blockUser(1, 2);
  const result = unblockUser(1, 2);
  assert.equal(result, true);
});

test('unblockUser throws on missing parameters', () => {
  assert.throws(
    () => unblockUser(1),
    (err) => err instanceof HttpError && err.code === 400
  );
});

test('database rejects block with nonexistent user', () => {
  assert.throws(
    () =>
      db.prepare('INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)').run(
        1,
        999
      ),
    /FOREIGN KEY/
  );
});
