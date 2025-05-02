import db from "../database/database.js";

export async function statisticsAll(reply) {
  console.log("WE in statistics");

  const stat = db.prepare("SELECT * FROM statistics").all();

  return reply.code(200).send({ stat });
}

export async function statisticsUser(req, reply) {
  console.log("WE IN USER STATISTICS");

  const { user_id } = req.body;

  try {
    const statUser = db.prepare("SELECT * FROM statistics WHERE user_id = ?").get(user_id);
    console.log("USER STAT =>", statUser);

    return reply.code(200).send({ statUser});

  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
