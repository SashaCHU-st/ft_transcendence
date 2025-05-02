import db from "../database/database.js";

export async function statisticsAll(reply) {
  console.log("WE in statistics");

  const stat = db.prepare(`SELECT statistics.user_id, statistics.wins, statistics.losses
  FROM users
  INNER JOIN statistics 
    ON users.id = statistics.user_id
    AND users.wins = statistics.wins
    AND users.losses = statistics.losses`).all();

  return reply.code(200).send({ stat });
}

export async function statisticsUser(req, reply) {
  console.log("WE IN USER STATISTICS");

  const { user_id } = req.body;

  try {
    const statUser = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(user_id);
    console.log("USER STAT =>", statUser.wins);

    const wins = statUser.wins
    const losses = statUser.losses

    return reply.code(200).send({ "wins":wins, "losses": losses});
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function win(req, reply) {
  console.log("WE IN WIN");

  const { user_id } = req.body;

  try {
    const winUser = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);

    console.log("Wins =>", winUser.wins);
    console.log("Updated=>", winUser.wins + 1);
    const haha = winUser.wins + 1;
    const updateWins = db
      .prepare("UPDATE users SET wins = ? WHERE id = ?")
      .run(haha, user_id);

    return reply.code(200).send({ updateWins });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function loseUser(req, reply) {
    console.log("WE IN WIN");
  
    const { user_id } = req.body;
  
    try {
      const loseUser = db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);
  
      console.log("Wins =>", loseUser.losses);
      console.log("Updated=>", loseUser.losses + 1);
      const haha = loseUser.losses + 1;
      const updateLoses = db
        .prepare("UPDATE users SET losses = ? WHERE id = ?")
        .run(haha, user_id);
  
      return reply.code(200).send({ updateLoses });
    } catch (err) {
      console.error("Database error:", err.message);
      return reply.code(500).send({ message: "Something went wrong" });
    }
  }
  