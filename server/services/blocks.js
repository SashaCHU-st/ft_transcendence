import db from '../database/database.js';
import HttpError from '../utils/http-error.js';

export function blockUser(blockerId, blockedId) {
  if (!blockerId || !blockedId) {
    throw new HttpError('Missing parameters', 400);
  }
  if (blockerId === blockedId) {
    throw new HttpError('Cannot block yourself', 400);
  }
  const blockerExists = db
    .prepare('SELECT 1 FROM users WHERE id = ?')
    .get(blockerId);
  if (!blockerExists) {
    throw new HttpError('User not found', 404);
  }
  const userExists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(blockedId);
  if (!userExists) {
    throw new HttpError('User not found', 404);
  }
  try {
    const result = db
      .prepare(
        'INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)'
      )
      .run(blockerId, blockedId);
    return result.changes > 0;
  } catch (err) {
    console.error('Error blocking user:', err.message);
    throw new HttpError('Failed to block user', 500);
  }
}

export function unblockUser(blockerId, blockedId) {
  if (!blockerId || !blockedId) {
    throw new HttpError('Missing parameters', 400);
  }
  const blockerExists = db
    .prepare('SELECT 1 FROM users WHERE id = ?')
    .get(blockerId);
  if (!blockerExists) {
    throw new HttpError('User not found', 404);
  }
  const userExists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(blockedId);
  if (!userExists) {
    throw new HttpError('User not found', 404);
  }
  try {
    const result = db
      .prepare('DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?')
      .run(blockerId, blockedId);
    return result.changes > 0;
  } catch (err) {
    console.error('Error unblocking user:', err.message);
    throw new HttpError('Failed to unblock user', 500);
  }
}

export function isBlocked(id1, id2) {
  const row = db
    .prepare(
      `SELECT 1 FROM blocks 
       WHERE (blocker_id = ? AND blocked_id = ?)
          OR (blocker_id = ? AND blocked_id = ?)
       LIMIT 1`
    )
    .get(id1, id2, id2, id1);
  return !!row;
}

export function listBlockedUsers(blockerId) {
  if (!blockerId) {
    throw new HttpError('Missing parameters', 400);
  }
  try {
    const rows = db
      .prepare('SELECT blocked_id FROM blocks WHERE blocker_id = ?')
      .all(blockerId);
    return rows.map((r) => r.blocked_id);
  } catch (err) {
    console.error('Error fetching blocked users:', err.message);
    throw new HttpError('Failed to fetch blocked users', 500);
  }
}
