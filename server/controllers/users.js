import db from "../database/database.js";

export async function allUsers(request, reply) {
  try {
    const rows = db.prepare("SELECT * FROM users").all();
    return reply.code(200).send({ users: rows });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return reply.code(500).send({ message: "Failed to fetch users" });
  }
}
