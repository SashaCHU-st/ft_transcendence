import db from "../database/database.js";
// import dbFriends from "../database/databaseFriends.js";

// see users but not friends
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

  const { user_id, friend_id } = req.body;
  console.log("id=>", user_id);
  console.log("friend_id=>", friend_id);

  if (!user_id)
    return reply.code(400).send({ message: "PLease fill in friend nickname" });

  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE id IN (?, ?)")
      .get(user_id, friend_id);
    console.log("THERE is such nickname", hasUser);

    if (!hasUser) {
      return reply.code(400).send({ message: "Not such user" });
    }
    if (hasUser) {
      const friendAlready1 = db
        .prepare(
          "SELECT * FROM friends WHERE user_id = ? AND friends_id = ? OR friends_id = ? AND user_id = ?"
        )
        .get(user_id, friend_id, friend_id, user_id);

      if (friendAlready1) {
        return reply.code(400).send({ message: "Friend already" });
      } else {
        const add = db
          .prepare("INSERT INTO friends (user_id, friends_id) VALUES (?,? )")
          .run(user_id, friend_id);
        return reply.code(200).send({ message: "we have this user", hasUser });
      }
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

//Confirm friends
export async function confirmFriend(req, reply) {
  console.log("WE IN CONFIRM FRIEND");

  const { user_id, friend_id, confirmReq } = req.body;

  try {
    const checkReq1 = db
      .prepare(
        "SELECT * FROM friends WHERE user_id = ? AND friends_id = ? OR friends_id = ? AND user_id = ?"
      )
      .get(user_id, friend_id, user_id, friend_id);
    if (checkReq1) {
      const confirmAccept1 = db
        .prepare(
          "UPDATE friends SET confirmReq = ? WHERE user_id = ? AND friends_id = ? OR user_id = ? AND friends_id = ?"
        )
        .run(confirmReq, user_id, friend_id, friend_id, user_id);
      console.log("CONFIRM =>....", confirmAccept1);
    }
    if (!checkReq1) {
      return reply.code(400).send({ message: "No request" });
    }
    // confirmAccept.run();
    return reply.code(200).send({ message: "confirmed" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

///SEE the own friends
export async function myFriends(req, reply) {
  console.log("WE IN MY FRIENDS");

  const { user_id } = req.body;

  try {
    const myfriends = db
      .prepare(
        "SELECT * FROM friends WHERE user_id = ? OR friends_id = ? AND confirmReq = 1"
      )
      .all(user_id, user_id);

    return reply.code(200).send({ myfriends });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

/// delete from friends
export async function deleteFriend(req, reply) {
  console.log("WE IN MY DELETE FRIENDS");

  const { user_id, friends_id } = req.body;

  try {
    const deleteFr = db
      .prepare("DELETE FROM friends WHERE user_id = ? AND friends_id = ?")
      .run(user_id, friends_id);
    return reply.code(200).send({ deleteFr });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
