import db from '../database/database.js';

export async function challenge(req, reply) {
  const { user_id, username } = req.body;

  try {
    const friends_id = db
      .prepare(`SELECT * FROM users WHERE username = ? AND online = 1`)
      .get(username);

    if (!friends_id) {
      return reply.code(404).send({ message: 'User not found online' });
    }
    const alreadyChallengedBefore = db
      .prepare(
        `SELECT * FROM challenge WHERE user_id = ? AND friends_id = ? OR friends_id = ? AND user_id = ?`
      )
      .get(user_id, friends_id.id, user_id, friends_id.id);
    if (!alreadyChallengedBefore) {
      const sendRequest = db
        .prepare(`INSERT INTO challenge (user_id, friends_id) VALUES (?,?)`)
        .run(user_id, friends_id.id);
      return reply
        .code(201)
        .send({ message: 'Request sent', request: sendRequest });
    } else {
      return reply.code(400).send({
        message: 'Challenge has been called once',
      });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function notification(req, reply) {
  const { user_id } = req.body;

  try {
    const notification = db
      .prepare(
        `
        SELECT challenge.*, users.username
        FROM challenge 
        JOIN users ON challenge.user_id = users.id 
        WHERE challenge.friends_id = ? AND challenge.confirmReq = 2`
      )
      .all(user_id);

    console.log('notifications =>', notification);
    const accptedFromPartner = db
      .prepare(
        `SELECT challenge.*, users.username
      FROM challenge
      JOIN users ON challenge.user_id = users.id 
      WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 0`
      )
      .all(user_id);


      console.log("RRRR=>", accptedFromPartner)
    const notAcceptedFromPartner = db
      .prepare(
        `SELECT challenge.*, users.username
      FROM challenge
      JOIN users ON challenge.user_id = users.id 
      WHERE challenge.user_id = ? AND challenge.confirmReq = 0 AND challenge.ok = 0`
      )
      .all(user_id);

    const acceptedUsers = accptedFromPartner.map((ch) => {
      return {
        ...ch,
        partner: db
          .prepare(`SELECT username FROM users WHERE id = ?`)
          .get(ch.friends_id),
      };
    });
    const usernames = acceptedUsers.map((user) => ({
      username: user.partner.username,
    }));

    const notAcceptedUsers = notAcceptedFromPartner.map((ch) => {
      return {
        ...ch,
        partner: db
          .prepare(`SELECT username FROM users WHERE id = ?`)
          .get(ch.friends_id),
      };
    });
    const usernamesNotAccepted = notAcceptedUsers.map((user) => ({
      username: user.partner.username,
    }));
    console.log('Usernames not accepted', usernamesNotAccepted);

    //not really neeeded, delete later
    const acceptedSeen = db
      .prepare(
        `SELECT challenge.*, users.username
      FROM challenge
      JOIN users ON challenge.friends_id = users.id
      WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 1
    `
      )
      .all(user_id);

    if (notification.length === 0) {
      return reply.code(200).send({
        message: 'No challenge found',
        notification: [],
        acceptedUsers,
        notAcceptedUsers,
        acceptedSeen,
        usernames,
        usernamesNotAccepted,
      });
    } else {
      return reply
        .code(200)
        .send({
          message: 'There is request',
          friends_id: notification.user_id,
          notification,
        });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function sawAccept(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const sawOk = db
      .prepare(
        `UPDATE challenge SET ok = 1 WHERE user_id = ? AND friends_id = ?`
      )
      .run(user_id, friends_id);

    return reply.code(200).send({ message: 'Saw ok', sawOk });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function accept(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const acceptReq = db
      .prepare(
        `UPDATE challenge SET confirmReq = 1 WHERE user_id =? AND friends_id =? RETURNING id`
      )
      .run(friends_id, user_id);


      console.log("FFFFFFFFFFF=>", acceptReq.lastInsertRowid)
    const gameStarts = db
      .prepare(`INSERT INTO game (challenge_id, date ) VALUES (?,?)`)
      .run(acceptReq.lastInsertRowid, new Date().toISOString());

    return reply.code(201).send({ message: 'Accepted', acceptReq, challenge_id: acceptReq.lastInsertRowid });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function decline(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const declineReq = db
      .prepare(
        `UPDATE challenge SET confirmReq = 0 WHERE friends_id = ? AND user_id = ?`
      )
      .run(user_id, friends_id);

    return reply.code(200).send({ message: 'Deleted', declineReq });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
