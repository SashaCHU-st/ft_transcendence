import db from "../database/database.js";

export async function addfavorites(req, reply) {
  console.log("WE IN FAV");
  const { user_id, username } = req.body;
  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);

    console.log(user.username);
    if (String(username) === String(user.username)) {
      return reply.code(400).send({ message: "Cannot add yourself" });
    }
    const alreadyFav = db
      .prepare(`SELECT * FROM favorites WHERE user_id = ? AND username = ?`)
      .get(user_id, username);
    if (!alreadyFav) {
      const addFav = db
        .prepare(`INSERT INTO favorites (user_id, username) VALUES (?,?)`)
        .run(user_id, username);
      return reply.code(201).send({ message: "Added to my favorite", addFav });
    } else {
      return reply.code(400).send({ message: "Already friends" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function deletefavorites(req, reply) {
  console.log("we in delete");

  const {user_id, username} = req.body;

  try
  {
    const deleteFav = db.prepare(`DELETE FROM favorites WHERE user_id = ? AND username =?`).run(user_id, username)

        return reply.code(200).send({ deleteFav });
  }catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
