import db from "../database/database.js"; // Using better-sqlite3
import bcrypt, { hash } from "bcrypt";

export async function signup(req, reply) {
  console.log("We are in SIGNUP middleware");

  const { name, username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Validate request body
  if (!name || !password || !email || !username) {
    return reply
      .code(400)
      .send({ message: "No pass or name or email or username" });
  }

  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
      .get(email, username);
    console.log("Has user", hasUser);
    if (!hasUser) {
      const users = db.prepare(
        "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)"
      );
      const result = users.run(name, username, email, hashedPassword);
      const token = req.jwt.sign({
        id: result.lastInsertRowid,
      });

      console.log("TOKEN_ID", token);

      console.log("USER_ID =>", result.lastInsertRowid);

      // Set user online
      const online = db
        .prepare(`UPDATE users SET online = ? WHERE id = ?`)
        .run(1, result.lastInsertRowid);

      // Verify online status
      const updated = db
        .prepare(`SELECT id, online FROM users WHERE id = ?`)
        .get(result.lastInsertRowid);

      console.log("ONLINE? =>", updated);

      return reply
        .code(201)
        .send({ message: "USER created", users, accessToken: token });
    } else {
      console.log("User already exists");
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
    console.log("Query result:", user); // Log the result

    if (user) {
      const compareHashed = await bcrypt.compare(password, user.password);

      if (compareHashed) {
        const token = req.jwt.sign({
          id: user.id,
        });
        // const token = jwt.sign(
        //   { userId: user.id },
        //   { expiresIn: "2h" }
        // );
        const online = db
          .prepare(`UPDATE users SET online = '1' WHERE id = ?`)
          .run(user.id);

        console.log("ONLINE =>", online.changes);
        return reply
          .code(200)
          .send({ message: "We are logged in", accessToken: token });
      } else {
        return reply.code(400).send({ message: "wrong pass" });
      }
    } else {
      return reply.code(400).send({ message: "no such as user" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function logout(req, reply) {
  const { email } = req.body;
  try {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

    if (!user) {
      return reply.code(400).send({ message: "No such user" });
    }

    console.log("ID=>", user.id);

    const offline = db
      .prepare("UPDATE users SET online = ? WHERE email = ?")
      .run(0, email);
    console.log("Offline =>", offline.changes);
    return reply.code(200).send({ message: "We are logged out" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function getCurrentUser(req, reply) {
  try {
    const userId = req.user.id;
    const user = db
      .prepare(
        "SELECT id, name, username, email, online, image FROM users WHERE id = ?"
      )
      .get(userId);

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
