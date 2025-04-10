import HttpError from "../http-error.js";
import db from "../database/database.js";  // Using better-sqlite3

export async function signup(req, reply) {
  console.log("We are in SIGNUP middleware");

  const { name, email ,password} = req.body;

  // Validate request body
  if (!name || !password || !email) {
    return reply.code(400).send({ message: "No pass or name or email" });
  }

  try {
    const users = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    users.run(name, email, password);

    // const kuku = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(users.lastInsertRowId)
    // console.log("!!!!",kuku);
    
    return reply.code(201).send({ message: "USER created" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

