import db from "../database/database.js";

export async function challenge(req, reply) {
  const { user_id, username } = req.body;

  try {
    const friends_id = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);
    // console.log("MMMMMMM=>")
    // console.log("UUUU=>", user_id)
    // console.log("UUUU=>", friends_id.id)

    if (!friends_id) {
      return reply.code(404).send({ message: "User not found" });
    }
    const alreadyChallengedBefore = db
      .prepare(`SELECT * FROM challenge WHERE user_id = ? AND friends_id = ?`)
      .get(user_id, friends_id.id);
    // console.log("NNNNNN=>", alreadyChallengedBefore)
    if (!alreadyChallengedBefore) {
      const sendRequest = db
        .prepare(`INSERT INTO challenge (user_id, friends_id) VALUES (?,?)`)
        .run(user_id, friends_id.id);
      return reply
        .code(201)
        .send({ message: "Request sent", request: sendRequest });
    } else {
      return reply
        .code(400)
        .send({
          message:
            "You already called once, wait when partner will accept or decline",
        });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

// export async function notification(req, reply) {
//   const { user_id } = req.body;
//   try {
//      const notification = db.prepare(`
//          SELECT challenge.*, users.username
//          FROM challenge
//          JOIN users ON challenge.user_id = users.id
//          WHERE challenge.friends_id = ? AND challenge.confirmReq = 0`)
//       .all(user_id);

//     if (notification.length === 0) {
//         console.log("FFFFFFFFFFFFF")
//         return reply.code(200).send({ message: "No challenge found", notification: [] });
//       } else {
//         return reply.code(200).send({ message: "There is request",friends_id: notification.user_id, notification });
//       }
//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }

export async function notification(req, reply) {
  const { user_id } = req.body;

  try {
    const notification = db
      .prepare(
        `
        SELECT challenge.*, users.username
        FROM challenge 
        JOIN users ON challenge.user_id = users.id 
        WHERE challenge.friends_id = ? AND challenge.confirmReq = 0`
      )
      .all(user_id);

    console.log("notifications =>", notification);
    const accptedFromPartner = db
      .prepare(
        `SELECT challenge.*, users.username
      FROM challenge
      JOIN users ON challenge.user_id = users.id 
      WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 0`
      )
      .all(user_id);

    const acceptedUsers = accptedFromPartner.map((ch) => {
      return {
        ...ch,
        partner: db
          .prepare(`SELECT username FROM users WHERE id = ?`)
          .get(ch.friends_id),
      };
    });
    const usernames = acceptedUsers.map((user) => ({
      username: user.partner.username,
    }));
    console.log("Usernames", usernames);

    // console.log("BBBBB=>",acceptedUsers[0].partner.username)

    const acceptedSeen = db
      .prepare(
        `
      SELECT challenge.*, users.username
      FROM challenge
      JOIN users ON challenge.friends_id = users.id
      WHERE challenge.user_id = ? AND challenge.confirmReq = 1 AND challenge.ok = 1
    `
      )
      .all(user_id);

    console.log("SSSSSSSSSSSSS=>", acceptedSeen);

    if (notification.length === 0) {
      console.log("FFFFFFFFFFFFF");
      return reply.code(200).send({
          message: "No challenge found",notification: [],acceptedUsers, acceptedSeen, usernames});
    } else {
      return reply.code(200).send({message: "There is request", friends_id: notification.user_id, notification});
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

// export async function  notifyAboutAccept(req, reply) {

//   console.log("We in SEEEE")

//   const {user_id} = req.body;

//   try
//   {
//     const kuku1 = db.prepare(`SELECT * FROM challenge WHERE user_id = ? AND confirmReq = 1 AND ok = 0`).get(user_id)

//     console.log("YYYYY=>", kuku1)
//     if(kuku1)
//     {

//       return reply.code(200).send({ message: "CHALLENGE ACCREPTED ", friend:kuku1.friends_id});
//     }

//     const kuku2= db.prepare(`SELECT * FROM challenge WHERE user_id = ? AND confirmReq = 1 AND ok = 1`).get(user_id)
//     if(kuku2)
//     {
//       console.log("OOOOOOOOOOOOOOOO")
//       return reply.code(200).send({ message: "CHALLENGE ACCREPTED BEFORE"});

//     }

//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }

export async function sawAccept(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const sawOk = db
      .prepare(
        `UPDATE challenge SET ok = 1 WHERE user_id = ? AND friends_id = ?`
      )
      .run(user_id, friends_id);

    console.log("SSSS=>", sawOk);

    return reply.code(200).send({ message: "Saw ok", sawOk });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function accept(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const acceptReq = db
      .prepare(
        `UPDATE challenge SET confirmReq = 1 WHERE user_id =? AND friends_id =?`
      )
      .run(friends_id, user_id);

    return reply.code(201).send({ message: "Accepted", acceptReq });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function decline(req, reply) {
  const { user_id, friends_id } = req.body;

  try {
    const declineReq = db
      .prepare(`DELETE FROM challenge WHERE friends_id = ? AND user_id = ?`)
      .run(user_id, friends_id);

    return reply.code(200).send({ message: "Deleted", declineReq });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
