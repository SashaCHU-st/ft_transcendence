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

    const challengeSentOnce = db.prepare(`
      SELECT * FROM challenge
      WHERE user_id = ? AND friends_id = ? AND sent_once = ? AND game_end = ?
    `).get(user_id, friends_id.id, 1, 0);


    if(!challengeSentOnce)
    {
      const sendRequest = db
        .prepare(`INSERT INTO challenge (user_id, friends_id, sent_once) VALUES (?,?, ?) RETURNING id`)
        .run(user_id, friends_id.id, 1);

        console.log("YYYYYYYYYYYYYYYYYYYYYYYYYY=>",sendRequest.lastInsertRowid)
      return reply.code(201).send({ message: 'Request sent', request: sendRequest, challenge_id : sendRequest.lastInsertRowid});
    }
    else
    {
      return reply
        .code(400)
        .send({ message: 'CHALLENGE HAVE BEEN SENT ONCE'});
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

    const accptedFromPartner = db
      .prepare(
        `SELECT challenge.*, users.username
          FROM challenge
          JOIN users ON challenge.user_id = users.id 
          WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 0`
      )
      .all(user_id);


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
    const acceptedSeen = db
      .prepare(
        `SELECT challenge.*, users.username
          FROM challenge
          JOIN users ON challenge.friends_id = users.id
          WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 1`
      )
      .all(user_id);

    // ✅ Mark accepted challenges as "seen" by setting ok = 1
    if (acceptedUsers.length > 0) {
      db.prepare(`
        UPDATE challenge 
        SET ok = 1
        WHERE user_id = ? AND confirmReq = 1 AND ok = 0
      `).run(user_id);
    }

    if (notAcceptedUsers.length > 0)
    {
       db.prepare(
        `UPDATE challenge 
        SET ok = 1 
        WHERE user_id = ? AND confirmReq = 0 AND ok = 0`
      ).run(user_id);
    };

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
      return reply.code(200).send({
        message: 'There is request',
        friends_id: notification.user_id,
        acceptedUsers,
        notAcceptedUsers,
        acceptedUsers,
        notAcceptedUsers,
        notification,
      });
    }
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
        `UPDATE challenge SET confirmReq = 1 WHERE user_id = ? AND friends_id = ? RETURNING id`
      )
      .get(friends_id, user_id);
    return reply
      .code(201)
      .send({
        message: 'Accepted',
        id:acceptReq,
        challenge_id: acceptReq.id,
      });
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
        `UPDATE challenge SET confirmReq = 0, game_end = 1 WHERE friends_id = ? AND user_id = ?`
      )
      .run(user_id, friends_id);

    return reply.code(200).send({ message: 'Deleted', declineReq });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function getChallengeStats(req, reply) {
  const userId = Number(req.params.user_id || req.body?.user_id || req.query.user_id);
  try {
    const sent = db.prepare('SELECT COUNT(*) AS count FROM challenge WHERE user_id = ?').get(userId).count;
    const received = db.prepare('SELECT COUNT(*) AS count FROM challenge WHERE friends_id = ?').get(userId).count;
    const accepted = db.prepare('SELECT COUNT(*) AS count FROM challenge WHERE (user_id = ? OR friends_id = ?) AND confirmReq = 1').get(userId, userId).count;
    const declined = db.prepare('SELECT COUNT(*) AS count FROM challenge WHERE (user_id = ? OR friends_id = ?) AND confirmReq = 0').get(userId, userId).count;
    const games = db.prepare('SELECT COUNT(*) AS count FROM game WHERE challenge_id IN (SELECT id FROM challenge WHERE user_id = ? OR friends_id = ?)').get(userId, userId).count;
    const topChallenged = db
      .prepare(`SELECT users.username AS username, COUNT(*) AS count FROM challenge JOIN users ON challenge.friends_id = users.id WHERE challenge.user_id = ? GROUP BY friends_id ORDER BY count DESC LIMIT 1`)
      .get(userId) || null;
    const topChallenger = db
      .prepare(`SELECT users.username AS username, COUNT(*) AS count FROM challenge JOIN users ON challenge.user_id = users.id WHERE challenge.friends_id = ? GROUP BY user_id ORDER BY count DESC LIMIT 1`)
      .get(userId) || null;

    return reply.code(200).send({
      sent,
      received,
      accepted,
      declined,
      games,
      topChallenged,
      topChallenger,
    });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

