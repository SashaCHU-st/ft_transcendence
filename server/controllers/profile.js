import db from "../database/database.js";
import { hashedPassword } from "../utils/hashedPass.js";

export async function updateProfile(req, reply) {

  const { name, username, password } = req.body;
  const userId = req.user.id;

  if (!name && !username && !password) {
    return reply.code(400).send({ message: "Nothing to change" });
  }
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    if (name) {
      db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, userId);
    }
    if (password) {
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(await hashedPassword(password), userId);
    }
    if (username) {
      const nickExist = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username);
      if (nickExist) {
        return reply.code(400).send({ message: "Nick already exists" });
      } else {
        db.prepare("UPDATE users SET username = ? WHERE id = ?").run(username, userId);
      }
    }
    return reply.code(200).send({ message: "Profile updated" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function uploadPicture(data, reply) {
  const allowedTypes = ["image/jpeg", "image/png"];
  const userId = reply.request.user.id;

  if (!data) {
    return reply.code(400).send({ message: "No image to upload" });
  }

  if (!allowedTypes.includes(data.mimetype)) {
    return reply.code(400).send({ message: "Invalid image format" });
  }
  try {
    db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    const buffer = await data.toBuffer();
    db.prepare("UPDATE users SET image = ? WHERE id = ?").run(buffer, userId);
    return reply.code(200).send({ message: "Image uploaded" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}