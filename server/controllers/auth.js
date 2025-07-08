import db from '../database/database.js';
import bcrypt from 'bcrypt';
import hashedPassword from '../utils/hashedPass.js';
import transporter from '../utils/mailer.js';
import { activeCodes } from '../utils/codes.js';

export async function signup(req, reply) {
  const { name, username, email, password } = req.body;
  if (!name || !password || !email || !username) {
    return reply
      .code(400)
      .send({ message: 'No pass or name or email or username' });
  }
  try {
    const hasUser = db
      .prepare('SELECT * FROM users WHERE email = ? OR username = ?')
      .get(email, username);
    if (!hasUser) {
      const users = db.prepare(
        'INSERT INTO users (name, username, email, password,twofa_enabled, online) VALUES (?, ?, ?, ?,?, ?)'
      );
      const result = users.run(
        name,
        username,
        email,
        await hashedPassword(password),
        1,
        1
      );
      const token = req.jwt.sign({
        id: result.lastInsertRowid,
      });
      db.prepare(`UPDATE users SET online = ? WHERE id = ?`).run(1, result.lastInsertRowid);

      db.prepare(`SELECT id, online FROM users WHERE id = ?`).get(result.lastInsertRowid);
      return reply.code(201).send({ message: "USER created", users, accessToken: token, id:result.lastInsertRowid});
    } else {
      return reply.code(400).send({ message: 'User already exists' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function login(req, reply) {
  const { email, password } = req.body;

  if (!password || !email) {
    return reply.code(400).send({ message: 'No pass or email' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return reply.code(400).send({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.code(400).send({ message: 'Wrong password' });
    }
    if (user.twofa_enabled) {
      return reply.code(200).send({ twoFactor: true });
    }

    const token = req.jwt.sign({ id: user.id });
    db.prepare('UPDATE users SET online = 1 WHERE id = ?').run(user.id);

    return reply.code(200).send({
      message: 'Logged in successfully',
      accessToken: token,
      id: user.id,
    });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function logout(req, reply) {
  const { user_id } = req.body;
  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);

    if (!user) {
      return reply.code(400).send({ message: 'No such user' });
    }
    db.prepare("UPDATE users SET online = ? WHERE id = ?").run(0, user_id);
    return reply.code(200).send({ message: "We are logged out" });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function getCurrentUser(req, reply) {
  try {
    const userId = req.user.id;
    const user = db
      .prepare(
        'SELECT id, name, username, email, online, image FROM users WHERE id = ?'
      )
      .get(userId);

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    return reply.code(200).send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        online: user.online,
        image: user.image ? Buffer.from(user.image).toString('base64') : null,
      },
    });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function twoFASend(req, reply) {
  const { email } = req.body;
  if (!email) {
    return reply.code(400).send({ error: 'Email is required' });
  }

  const now = Date.now();
  const existing = activeCodes.get(email);
  if (existing && existing.expiresAt - 4 * 60 * 1000 > now) {
    return reply
      .code(429)
      .send({ error: 'Wait before requesting another code' });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 5 * 60 * 1000;
  activeCodes.set(email, { code, expiresAt });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your 2FA Code',
      text: `Your verification code is: ${code}. It will expire in 5 minutes.`,
    });
    return reply.code(200).send({ success: true, info });
  } catch (err) {
    console.error('Error sending 2FA email:', err);
    return reply.code(500).send({ error: 'Failed to send email' });
  }
}

export async function twoFAVerify(req, reply) {
  const { email, code } = req.body;

  if (!email || !code) {
    return reply.code(400).send({ error: 'Email and code required' });
  }

  const entry = activeCodes.get(email);
  if (!entry || entry.expiresAt < Date.now()) {
    return reply.code(400).send({ error: 'Code expired or not found' });
  }

  if (entry.code !== code) {
    return reply.code(401).send({ error: 'Invalid code' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return reply.code(400).send({ error: 'User not found' });
  }

  const token = req.jwt.sign({ id: user.id });

  activeCodes.delete(email);
  return reply
    .code(200)
    .send({ success: true, accessToken: token, id: user.id });
}
