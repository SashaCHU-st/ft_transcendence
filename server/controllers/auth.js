import db from "../database/database.js"; 
import bcrypt from "bcrypt";
import hashedPassword from "../utils/hashedPass.js"

export async function signup(req, reply) {

  const { name, username, email, password } = req.body;
  if (!name || !password || !email || !username) {
    return reply.code(400).send({ message: "No pass or name or email or username" });
  }
  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
      .get(email, username);
    if (!hasUser) {
      const users = db.prepare(
        "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)"
      );
      const result = users.run(name, username, email,await hashedPassword(password));
      const token = req.jwt.sign({
        id: result.lastInsertRowid,
      });
      db.prepare(`UPDATE users SET online = ? WHERE id = ?`).run(1, result.lastInsertRowid);

       db.prepare(`SELECT id, online FROM users WHERE id = ?`).get(result.lastInsertRowid);
      return reply.code(201).send({ message: "USER created", users, accessToken: token, id:result.lastInsertRowid});
    } else {
      return reply.code(400).send({ message: "User already exists" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function login(req, reply) {
  const { email, password } = req.body;

  if (!password || !email) {
    return reply.code(400).send({ message: "No pass or email" });
  }

  try {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

    if (user) {
      const compareHashed = await bcrypt.compare(password, user.password);

      if (compareHashed) {
        const token = req.jwt.sign({
          id: user.id,
        });
        db.prepare(`UPDATE users SET online = '1' WHERE id = ?`).run(user.id);

        return reply.code(200).send({ message: "We are logged in", accessToken: token, id:user.id});
      } else {
        return reply.code(400).send({ message: "Wrong pass" });
      }
    } else {
      return reply.code(400).send({ message: "No such as user" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function logout(req, reply) {
  const { user_id } = req.body;
  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user_id);

    if (!user) {
      return reply.code(400).send({ message: "No such user" });
    }
    db.prepare("UPDATE users SET online = ? WHERE id = ?").run(0, user_id);
    return reply.code(200).send({ message: "We are logged out" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function getCurrentUser(req, reply) {
  try {
    const userId = req.user.id;
    const user = db.prepare("SELECT id, name, username, email, online, image FROM users WHERE id = ?").get(userId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    return reply.code(200).send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        online: user.online,
        image: user.image ? Buffer.from(user.image).toString("base64") : null,
      },
    });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
