import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../database/database.js';
import { handleChatMessage, MAX_MESSAGE_LENGTH } from '../services/chatMessages.js';

test.beforeEach(() => {
  db.exec('DELETE FROM messages');
});

test('handleChatMessage inserts valid message', () => {
  const result = handleChatMessage(1, 2, 'Hello');
  assert.equal(result.status, 201);
  assert.ok(result.message.id);
  const row = db.prepare('SELECT text FROM messages WHERE id = ?').get(result.message.id);
  assert.equal(row.text, 'Hello');
});

test('handleChatMessage returns error for missing parameters', () => {
  const result = handleChatMessage(undefined, 2, 'Hello');
  assert.equal(result.status, 400);
  assert.equal(result.error, 'Missing parameters');
});

test('handleChatMessage rejects too long message', () => {
  const longText = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
  const result = handleChatMessage(1, 2, longText);
  assert.equal(result.status, 400);
  assert.equal(result.error, 'Message too long');
});
