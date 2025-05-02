import db from "../database/database.js";

export async function updateProfile(req, reply) {
  console.log("WE in Update Profile MW");
  const { name, nickname, id, password } = req.body;

  if (!name && !nickname && !password) {
    return reply.code(400).send({ message: "Notning to change" });
  }
  // console.log("name", name);
  console.log("idddd", id);
  try {
    console.log("id", id);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id); ///Here we need id not id!!!!!!
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
          .prepare("UPDATE users SET password = ? WHERE id = ?")
          .run(password, id);
        console.log("password UPDATED =>", updatePassword);
        // return reply.code(200).send({message: "password updated"})
      }
      if (nickname) {
        console.log("we are in nick change");
        const nickExist = db
          .prepare("SELECT * FROM users WHERE nickname = ?")
          .get(nickname);
        console.log("NickExist =>", nickExist);
        if (nickExist) {
          return reply.code(400).send({ message: "Nick already exists" });
        } else {
          const updateNickname = db
            .prepare("UPDATE users SET nickname = ? WHERE id = ?")
            .run(nickname, id);
          console.log("nickname UPDATED =>", updateNickname);
          // return reply.code(200).send({message: "Nick updated"})
        }
      }
      return reply.code(200).send({ message: "updated" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}






export async function uploadPicture(pic,reply) {
  console.log("Kuku from upload pictures");

  const allowedTypes = ["image/jpeg", "image/png"];

  // const { image, email } = req.body;

  if (!pic) {
    return reply.code(400).send({ message: "no image to upload" });
  }

  if (!allowedTypes.includes(pic.mimetype)) {
    return reply.code(400).send({ message: "invalidddd" });
  }
  
  // const email = pic.fields?.email;
  // if (!email) {
  //   return reply.code(400).send({ message: "no email provided" });
  // }
  const id = pic.fields?.id.value;
  try {
    console.log("eeeeeeeeeeeeeee");
    console.log("id=>", id)
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id); 
    console.log("user ok => ", user.id);

    const buffer = await pic.toBuffer();

    db.prepare("UPDATE users SET image = ? WHERE id = ?").run(buffer, user.id);
    return reply.code(200).send({ message: "Image uploaded" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
