import db from '../database/database.js';

export async function friendsSearch(req, reply) {
  const { username } = req.body;

  if (!username)
    return reply.code(400).send({ message: 'PLease fill in friend username' });

  try {
    const hasUser = db
      .prepare(`SELECT * FROM users WHERE username = ? `)
      .get(username);
    if (!hasUser) {
      return reply.code(400).send({ message: 'Not such user' });
    }
    if (hasUser) {
      return reply.code(200).send({ message: 'we have this user', hasUser });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}
export async function friendsAdd(req, reply) {

  const { user_id, username } = req.body;

  if (!username)
    return reply.code(400).send({ message: 'PLease fill in friend username' });

  const friend = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: "NO such as friend" });
  }
  if (Number(user_id) === friend.id) {
    return reply.code(400).send({ message: "Cannot add yourself" });
  }

  try {
    const hasUser2 = db
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .get(friend.id);

    if (!hasUser2) {
      return reply.code(400).send({ message: 'Not such user' });
    }
    if (hasUser2) {
      const friendAlready1 = db
        .prepare(
          `SELECT saw FROM friends WHERE ((user_id = ? AND friends_id = ?)  OR (user_id = ? AND friends_id = ?))  AND saw = 1`)
        .get(user_id, friend.id, friend.id, user_id);
      if (friendAlready1) {
        return reply
          .code(400)
          .send({ message: 'Friend already or already have sent request' });
      } else {
        const add = db
          .prepare(`INSERT INTO friends (user_id, friends_id) VALUES (?,? )`)
          .run(user_id, friend.id);
        return reply.code(200).send({ message: 'we have this user', add });
      }
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function confirmFriend(req, reply) {
  const { user_id, username, confirmReq } = req.body;

  const friend = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: 'NO such as friebd' });
  }
  try {
    const checkReq1 = db
      .prepare(`SELECT * FROM friends WHERE friends_id = ? AND user_id = ?`)
      .get(user_id, friend.id);
    if (checkReq1) {
        db.prepare(`UPDATE friends SET confirmReq = 1 WHERE friends_id = ? AND user_id = ? `)
        .run(user_id, friend.id);
      return reply.code(200).send({ message: 'confirmed' });
    }
    if (!checkReq1) {
      return reply.code(400).send({ message: 'No request' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function declineFriend(req, reply) {
  const { user_id, username, confirmReq } = req.body;

  const friend = db
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: 'NO such as friebd' });
  }
  try {
    const checkReq1 = db
      .prepare(`SELECT * FROM friends WHERE friends_id = ? AND user_id = ?`)
      .get(user_id, friend.id);
    if (checkReq1) {
      db.prepare(`UPDATE friends SET confirmReq = 0, saw = 1 WHERE friends_id = ? AND user_id = ? `)
        .run(user_id, friend.id);
      return reply.code(200).send({ message: 'confirmed' });
    }
    if (declineReq.changes === 0) {
  return reply.code(400).send({ message: 'No request' });
}
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function requestFriend(req, reply) {
  const { user_id } = req.body;
  try {
    const checkRequest = db.prepare(`
      SELECT 
        u.id, 
        u.username, 
        u.image, 
        u.online
      FROM friends f
      JOIN users u ON u.id = f.user_id
      WHERE f.friends_id = ? AND f.confirmReq = 2
    `).all(user_id);
    
    if(checkRequest)
    {
      return reply.code(200).send({ message: "There is request", checkRequest});
    }
    else
    {
      return reply.code(400).send({ message: "NO requests" });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}


export async function myFriends(req, reply) {

  const { user_id } = req.body;

  try {
    const myfriends = db
      .prepare(
        `SELECT * FROM friends WHERE (user_id = ? OR friends_id = ?) AND confirmReq = 1`
      )
      .all(user_id, user_id);
    if (myfriends) {
      return reply.code(200).send({ myfriends });
    } else {
      return reply.code(200).send({ message: 'No friends' });
    }
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function deleteFriend(req, reply) {

  const { user_id, username } = req.body;

  const friend = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: "NO such as friebd" });
  }
  try {
    const deleteFr = db
      .prepare(`DELETE FROM friends WHERE (user_id = ? AND friends_id = ?) OR (user_id = ? AND friends_id = ?)`)
      .run(user_id, friend.id, friend.id, user_id);
    return reply.code(200).send({ deleteFr });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}

export async function notificationFriends(req, reply) {

  const { user_id } = req.body;

  try {
    const checkNotif = db
      .prepare(
        `SELECT friends.*, users.username
        FROM friends 
        JOIN users ON friends.user_id = users.id 
        WHERE friends.friends_id = ? AND friends.confirmReq = 2  AND saw = 0`
      )
      .all(user_id);

    const seeIfFriendAccepted = db
      .prepare(
        `SELECT friends.*, users.username
        FROM friends 
        JOIN users ON friends.user_id = users.id 
        WHERE friends.user_id = ? AND friends.confirmReq = 1 `
      )
      .all(user_id);

    const acceptedUsers = seeIfFriendAccepted.map((ch) => {
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

    const seeIfFriendDeclined = db
      .prepare(
        `SELECT friends.*, users.username
        FROM friends 
        JOIN users ON friends.user_id = users.id 
        WHERE friends.user_id = ? AND friends.confirmReq = 0 AND saw = 1`
      )
      .all(user_id);

    const declinedUsers = seeIfFriendDeclined.map((ch) => {
      return {
        ...ch,
        partner: db
          .prepare(`SELECT id, username FROM users WHERE id = ?`)
          .get(ch.friends_id),
      };
    });

    const usernamesDeclined = declinedUsers.map((user) => ({
      username: user.partner.username, 
      id:user.partner.id
    }));


    return reply.code(200).send({
      message: 'Notification',
      checkNotif,
      seeIfFriendAccepted,
      usernames,
      seeIfFriendDeclined,
      usernamesDeclined,
    });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}


export async function sawAccept(req, reply) {
  const { user_id, username } = req.body;


const username_id = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username)

  try {
    const sawOk = db
      .prepare(
        `UPDATE friends SET saw = 2 WHERE user_id = ? AND friends_id = ?`
      )
      .run(user_id, username_id.id);

    return reply.code(200).send({ message: 'Saw ok', sawOk });
  } catch (err) {
    console.error('Database error:', err.message);
    return reply.code(500).send({ message: 'Something went wrong' });
  }
}