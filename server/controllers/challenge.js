import db from "../database/database.js";

export async function challenge(req, reply) {


  const { user_id, username } = req.body;

  try {
    const friends_id = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
        // console.log("MMMMMMM=>")
        // console.log("UUUU=>", user_id)
        // console.log("UUUU=>", friends_id.id)
      const alreadyChallengedBefore = db.prepare(`SELECT * FROM challenge WHERE user_id = ? AND friends_id = ?`).get(user_id, friends_id.id)
      // console.log("NNNNNN=>", alreadyChallengedBefore)
      if(!alreadyChallengedBefore)
      {
        const sendRequest = db
          .prepare(`INSERT INTO challenge (user_id, friends_id) VALUES (?,?)`)
          .run(user_id, friends_id.id);
        return reply
          .code(201)
          .send({ message: "Request sent", request: sendRequest });

      }
      else
      {
      return reply.code(400).send({ message: "You already called once, wait when partner will accept or decline" });
      }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function notification(req, reply) {
  const { user_id } = req.body;


  try {
        const notification = db.prepare(`
        SELECT challenge.*, users.username
        FROM challenge 
        JOIN users ON challenge.user_id = users.id 
        WHERE challenge.friends_id = ? AND challenge.confirmReq = 0`)
      .all(user_id);

    console.log("notifications =>", notification);
      if (notification.length === 0) {
        return reply.code(200).send({ message: "No challenge found", notification: [] });
      } else {
        return reply.code(200).send({ message: "There is request",friends_id: notification.user_id, notification });
      }

  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function accept(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const acceptReq = db
      .prepare(
        `UPDATE challenge SET confirmReq = 1 WHERE user_id =? AND friends_id =?`,
      )
      .run(friends_id, user_id);

    return reply.code(201).send({ message: "Accepted", acceptReq });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function decline(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const declineReq = db
      .prepare(`DELETE FROM challenge WHERE friends_id = ? AND user_id = ?`)
      .run(user_id, friends_id);

      return reply.code(200).send({ message: "Deleted", declineReq });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
