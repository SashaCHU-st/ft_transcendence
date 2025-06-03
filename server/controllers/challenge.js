import db from "../database/database.js";

export async function challenge(req, reply) {


  const { user_id, username } = req.body;

  try {
    const friends_id = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    const sendRequest = db
      .prepare(`INSERT INTO challenge (user_id, friends_id) VALUES (?,?)`)
      .run(user_id, friends_id.id);
    return reply
      .code(201)
      .send({ message: "Request sent", request: sendRequest });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function notification(req, reply) {
  const { user_id } = req.body;
  try {
    const notification = db
      .prepare(
        `SELECT * FROM challenge WHERE friends_id = ? AND confirmReq = 0`,
      )
      .all(user_id);

      console.log("notification", notification);
    if (notification) {
      return reply
        .code(200)
        .send({ message: "There is request", friends_id: notification.user_id, notification:notification});
    } else {
      return reply.code(400).send({ message: "There is NO request" });
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
