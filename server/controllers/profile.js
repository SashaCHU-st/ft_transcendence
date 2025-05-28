import db from "../database/database.js";
import { hashedPassword } from "./auth.js";

export async function updateProfile(req, reply) {

  const { name, username, password } = req.body;
  const userId = req.user.id;

  if (!name && !username && !password) {
    return reply.code(400).send({ message: "Nothing to change" });
  }

  try {

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId); ///Here we need id not id!!!!!!
    console.log("user ok => ", user.id);
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    if (name) {
      const updateName = db
        .prepare("UPDATE users SET name = ? WHERE id = ?")
        .run(name, userId);
      console.log("NAME UPDATED =>", updateName);
      // return reply.code(200).send({message: "Name updated"})
    }
    if (password) {
      const updatePassword = db
        .prepare("UPDATE users SET password = ? WHERE id = ?")
        .run(await hashedPassword(password), userId);
      console.log("PASSWORD UPDATED =>", updatePassword);
      // return reply.code(200).send({message: "password updated"})
    }
    if (username) {
      console.log("we are in nick change");
      const nickExist = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username);
      console.log("NickExist =>", nickExist);
      if (nickExist) {
        return reply.code(400).send({ message: "Nick already exists" });
      } else {
        const updateUsername = db
          .prepare("UPDATE users SET username = ? WHERE id = ?")
          .run(username, userId);
        console.log("USERNAME UPDATED =>", updateUsername);
      }
    }
    return reply.code(200).send({ message: "Profile updated" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function uploadPicture(data, reply) {
  console.log("Kuku from upload pictures");
  const allowedTypes = ["image/jpeg", "image/png"];
  const userId = reply.request.user.id;

  if (!data) {
    return reply.code(400).send({ message: "No image to upload" });
  }

  if (!allowedTypes.includes(data.mimetype)) {
    return reply.code(400).send({ message: "Invalid image format" });
  }
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    console.log("user ok => ", user.id);

    const buffer = await data.toBuffer();

    db.prepare("UPDATE users SET image = ? WHERE id = ?").run(buffer, userId);
    return reply.code(200).send({ message: "Image uploaded" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}