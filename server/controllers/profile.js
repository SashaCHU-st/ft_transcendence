import db from "../database/database.js";

export async function updateProfile(req, reply) {
  console.log("WE in Update Profile MW");
  const { name, nickname, email, password } = req.body;/// not need email here!!!!

  if (!name && !nickname && !password) {
    return reply.code(400).send({ message: "Notning to change" });
  }
  console.log("name", name);
  console.log("EMail", email);
  try {
    console.log("EMail", email);
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email); ///Here we need id not EMAIL!!!!!!
    console.log("user ok => ", user.id);
    if (!user) {
      return reply.code(400).send({ message: "Notning to change" });
    }
    if (user) {
      if (name) {
        const updateName = db
          .prepare("UPDATE users SET name = ? WHERE id = ?")
          .run(name, user.id);
          console.log("NAME UPDATED =>", updateName);
          // return reply.code(200).send({message: "Name updated"})
      }
      if (password) {
        const updatePassword = db
          .prepare("UPDATE users SET password = ? WHERE email = ?")
          .run(password, email);
          console.log("password UPDATED =>", updatePassword);
          // return reply.code(200).send({message: "password updated"})
      }
      if (nickname) {
        console.log("we are in nick change")
        const nickExist = db
        .prepare("SELECT * FROM users WHERE nickname = ?").get(nickname);
        console.log("NickExist =>", nickExist);
        if(nickExist)
        {
          return reply.code(400).send({ message: "Nick already exists" });
        }
        else
        {
          const updateNickname = db
            .prepare("UPDATE users SET nickname = ? WHERE id = ?")
            .run(nickname, user.id);
            console.log("nickname UPDATED =>", updateNickname);
            // return reply.code(200).send({message: "Nick updated"})
        }
      }
      return reply.code(200).send({message: "updated"})

    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
