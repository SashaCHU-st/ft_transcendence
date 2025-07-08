import jwt from 'jsonwebtoken';
import db from '../database/database.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'kuku';

/**
 * Extract user information from a WebSocket request.
 * @param {import('http').IncomingMessage} req
 * @param {Object} [opts]
 * @param {boolean} [opts.requireToken=false] When true, fail if token is missing
 * @returns {{userId:number, username?:string}|null}
 */
export function wsAuth(req, { requireToken = false } = {}) {
  const queryIdx = req.url.indexOf('?');
  if (queryIdx === -1) return null;

  const params = new URLSearchParams(req.url.slice(queryIdx));
  const idParam = params.get('user_id');
  const token = params.get('token');

  if (requireToken && !token) return null;

  let userId;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const idFromToken = payload.id;
      if (idParam && parseInt(idParam, 10) !== idFromToken) {
        return null;
      }
      userId = idFromToken;
    } catch {
      return null;
    }
  } else if (idParam) {
    userId = parseInt(idParam, 10);
  } else {
    return null;
  }

  let username;
  try {
    const row = db.prepare('SELECT username FROM users WHERE id = ?').get(userId);
    if (row) username = row.username;
  } catch {}

  return { userId, username };
}

export default wsAuth;
