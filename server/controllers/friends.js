import db from "../database/database.js";
// import dbFriends from "../database/databaseFriends.js";

export async function friendsSearch(req, reply) {
  console.log("WE ARE IN FRIENDS");

  const { nickname } = req.body;

  if (!nickname)
    return reply.code(400).send({ message: "PLease fill in frien nickname" });

  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE nickname = ? ")
      .get(nickname);
    console.log("THERE is such nickname", hasUser);
    if (!hasUser) {
      return reply.code(400).send({ message: "Not such user" });
    }
    if (hasUser) {
      console.log("KUKU, lets add display user");
      return reply.code(200).send({ message: "we have this user", hasUser });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

/////ADD friends
export async function friendsAdd(req, reply) {
  console.log("WE ARE IN ADDING FRIENDS");

  const { id, id2 } = req.body;
  console.log("id=>", id);
  console.log("id2=>", id2);

  if (!id)
    return reply.code(400).send({ message: "PLease fill in friend nickname" });

  try {
    const hasUser = db.prepare("SELECT * FROM users WHERE id =? ").get(id);
    console.log("THERE is such nickname", hasUser);
    const hasUser2 = db.prepare("SELECT * FROM users WHERE id =? ").get(id2);
    console.log("THERE is such nickname22222", hasUser2);

    if (!hasUser) {
      return reply.code(400).send({ message: "Not such user" });
    }
    if (hasUser) {
      const friendAlready1 = db
        .prepare("SELECT * FROM friends WHERE userId1 = ? AND userId2 = ?")
        .get(id, id2);

      const friendAlready2 = db
        .prepare("SELECT * FROM friends WHERE userId2 = ? AND userId1 = ?")
        .get(id, id2);

      if (friendAlready1 || friendAlready2) {
        return reply.code(400).send({ message: "Friend already" });
      } else {
        console.log("KUKU, lets add display user");
        const add = db
          .prepare("INSERT INTO friends (userId1, userId2) VALUES (?,? )")
          .run(id, id2);
        // add.run();
        return reply
          .code(200)
          .send({ message: "we have this user", hasUser, hasUser2 });
      }
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function confirmFriend(req, reply) {
  console.log("WE IN CONFIRM FRIEND");

  const { id, id2, confirmReq } = req.body;

  console.log("1 ", id);
  console.log("2 ", id2);
  console.log("CONFIRM", confirmReq);
  try {
    const checkReq1 = db
      .prepare("SELECT * FROM friends WHERE userId1 = ? AND userId2 = ?")
      .get(id, id2);
    const checkReq2 = db
      .prepare("SELECT * FROM friends WHERE userId2 = ? AND userId1 = ?")
      .get(id, id2);
    console.log("REQUEST? =? ", checkReq1);
    console.log("REQUEST2222 =? ", checkReq2);

    // console.log("REQUEST? =? ",checkReq2);
    // if (!checkReq1 || !checkReq2) {
    //   return reply.code(400).send({ message: "No request" });
    // } else {
    if (checkReq1) {
      const confirmAccept1 = db
        .prepare(
          "UPDATE friends SET confirmReq = ? WHERE userId1 = ? AND userId2 = ?"
        )
        .run(confirmReq, id, id2);
        console.log("CONFIRM =>....", confirmAccept1);
    }
    if (checkReq2) {
      const confirmAccept2 = db
        .prepare(
          "UPDATE friends SET confirmReq = ? WHERE userId2 = ? AND userId1 = ?"
        )
        .run(confirmReq, id, id2);
        console.log("CONFIRM 222=>....", confirmAccept2);
    }
    if (!checkReq1 && !checkReq2) {
      return reply.code(400).send({ message: "No request" });
    }
    // confirmAccept.run();
    return reply.code(200).send({ message: "confirmed" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
