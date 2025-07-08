import { blockUser, unblockUser, listBlockedUsers } from '../services/blocks.js';
import HttpError from '../utils/http-error.js';

export function block(req, reply) {
  const { blockedId } = req.body;
  const authId = req.user?.id;
  try {
    const created = blockUser(authId, blockedId);
    return reply.code(created ? 201 : 200).send({ ok: true });
  } catch (err) {
    if (err instanceof HttpError) {
      return reply.code(err.code).send({ message: err.message });
    }
    console.error('Unexpected error blocking user:', err.message);
    return reply.code(500).send({ message: 'Failed to block user' });
  }
}

export function unblock(req, reply) {
  const { blockedId } = req.body;
  const authId = req.user?.id;
  try {
    const removed = unblockUser(authId, blockedId);
    if (!removed) {
      return reply.code(404).send({ message: 'Block not found' });
    }
    return reply.code(200).send({ ok: true });
  } catch (err) {
    if (err instanceof HttpError) {
      return reply.code(err.code).send({ message: err.message });
    }
    console.error('Unexpected error unblocking user:', err.message);
    return reply.code(500).send({ message: 'Failed to unblock user' });
  }
}

export function getBlocked(req, reply) {
  const blockerId = req.user?.id;
  try {
    const ids = listBlockedUsers(blockerId);
    return reply.code(200).send({ blocked: ids });
  } catch (err) {
    if (err instanceof HttpError) {
      return reply.code(err.code).send({ message: err.message });
    }
    console.error('Unexpected error fetching blocked users:', err.message);
    return reply.code(500).send({ message: 'Failed to fetch blocked users' });
  }
}
