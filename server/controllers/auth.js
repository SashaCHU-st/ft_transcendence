import HttpError from "../http-error.js";
import db from "../database/database.js"; // Using better-sqlite3

export async function signup(req, reply) {
  console.log("We are in SIGNUP middleware");

  const { name, nickname, email, password } = req.body;

  // Validate request body
  if (!name || !password || !email || !nickname) {
    return reply.code(400).send({ message: "No pass or name or email" });
  }

  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE email = ? OR nickname = ?")
      .get(email, nickname);
    console.log("Has user", hasUser);
    if (!hasUser) {
      const users = db.prepare(
        "INSERT INTO users (name, nickname, email, password) VALUES (?, ?, ?, ?)"
      );
      const result = users.run(name, nickname, email, password);

      console.log("ID =>", result.lastInsertRowid);

      const online = db
        .prepare("UPDATE users SET online = ? WHERE id = ?")
        .run(1, result.lastInsertRowid);

      // JUST CHECKING ONLINE
      const updated = db
        .prepare("SELECT id, online FROM users WHERE id = ?")
        .get(result.lastInsertRowid);

      console.log("ONLINE? =>", updated);

      return reply.code(201).send({ message: "USER created", users });
    } else {
      console.log("User already exist");
      return reply.code(400).send({ message: "User already exist" });
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
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    console.log("Query result:", user); // Log the result

    if (user) {
      console.log("Email", user.email);
      console.log("Pass", user.password);
      // reply.code(200).send({ message: "There is such a user", user });
      const kuku = db
        .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
        .get(email, password);
      console.log("kuku", kuku);
      if (kuku) {
        console.log("WE are logged in");
        const userOnline = db
          .prepare("SELECT * FROM users WHERE id = ?")
          .get(user.id);

        console.log("ID=>", user.id);
        // Put Online
        const online = db
          .prepare("UPDATE users SET online = '1' WHERE id = ?")
          .run(user.id);

        console.log("ONLINE =>", online.changes);

        return reply.code(200).send({ message: "We are logged in" });
      } else {
        console.log("Wrong pass ");
        return reply.code(400).send({ message: "Wrong pass" });
      }
    } else {
      return reply.code(400).send({ message: "No such user?" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function logout(req, reply) {
  const { email } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    console.log("ID=>",user.id)

    // console.log(logout);
    const offline = db.prepare("UPDATE users SET online = ? WHERE email = ?").run(0, email)
    console.log("Offline =>",offline)
    return reply.code(200).send({ message: "We are logout", user });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
