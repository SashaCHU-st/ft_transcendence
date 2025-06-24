import db from "../database/database.js";
// import dbFriends from "../database/databaseFriends.js";

// see users but not friends
export async function friendsSearch(req, reply) {
  console.log("WE ARE IN FRIENDS");

  const { username } = req.body;

  if (!username)
    return reply.code(400).send({ message: "PLease fill in frien username" });

  try {
    const hasUser = db
      .prepare(`SELECT * FROM users WHERE username = ? `)
      .get(username);
    // console.log("THERE is such username", hasUser);
    if (!hasUser) {
      return reply.code(400).send({ message: "Not such user" });
    }
    if (hasUser) {
      // console.log("KUKU, lets add display user");
      return reply.code(200).send({ message: "we have this user", hasUser });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

/////ADD friends
////FIX THIS THAT CANNOT ADD YOUERSELF!
export async function friendsAdd(req, reply) {
  console.log("WE ARE IN ADDING FRIENDS");

  const { user_id, username } = req.body;
  console.log("id=>", user_id);
  console.log("username=>", username);

  if (!username)
    return reply.code(400).send({ message: "PLease fill in friend username" });

  const friend = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: "NO such as friebd" });
  }

  console.log("ID friend=>>>>", friend.id);
  console.log("ID=>>>>", user_id);
  if (Number(user_id) === Number(friend.id)) {
    return reply.code(400).send({ message: "Cannot add yourself" });
  }

  try {
    const hasUser2 = db
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .get(friend.id);
    console.log("THERE is such username", hasUser2);

    if (!hasUser2) {
      return reply.code(400).send({ message: "Not such user" });
    }
    if (hasUser2) {
      const friendAlready1 = db
        .prepare(`SELECT * FROM friends WHERE (user_id = ? AND friends_id = ?) OR (user_id = ? AND friends_id = ?)`)
        .get(user_id, friend.id, friend.id, user_id);
      
      if (friendAlready1) {
        return reply.code(400).send({ message: "Friend already or already have sent request" });
      } else {
        const add = db
          .prepare(`INSERT INTO friends (user_id, friends_id) VALUES (?,? )`)
          .run(user_id, friend.id);
        return reply.code(200).send({ message: "we have this user", add });
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
  /// confirm just will be 1???
  const { user_id, username, confirmReq } = req.body;

  const friend = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: "NO such as friebd" });
  }

  // confirm can be accepted only from friend_id side
  try {
    const checkReq1 = db
      .prepare(`SELECT * FROM friends WHERE friends_id = ? AND user_id = ?`)
      .get(user_id, friend.id);
    if (checkReq1) {
      console.log("CoN=>", confirmReq);
      const confirmAccept1 = db
        .prepare(
          `UPDATE friends SET confirmReq = 1 WHERE (user_id = ? AND friends_id = ?) 
           OR (user_id = ? AND friends_id = ?)`
        )
        .run(user_id, friend.id, friend.id, user_id);
      console.log("CONFIRM =>....", confirmAccept1);
      return reply.code(200).send({ message: "confirmed" });
    }
    if (!checkReq1) {
      return reply.code(400).send({ message: "No request" });
    }
    // confirmAccept.run();
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function requestFriend(req, reply) {
  // console.log("WE in REQUESTTTT")
  const {user_id} = req.body;

  console.log("ISER=>", user_id)

  try {
    const checkRequest = db.prepare("SELECT * FROM friends WHERE friends_id = ? AND confirmReq = 0").all(user_id)
    // console.log("YYYY=>", checkRequest)
    if(checkRequest)
    {
      // console.log("TTTTT=>", checkRequest);
      return reply.code(200).send({ message: "There is request", checkRequest });
    }
    else
    {
      return reply.code(400).send({ message: "NO requests" });
    }

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
        `SELECT * FROM friends WHERE (user_id = ? OR friends_id = ?) AND confirmReq = 1`
      )
      .all(user_id, user_id);
    if (myfriends) {
      return reply.code(200).send({ myfriends });
    } else {
      return reply.code(200).send({ message: "No friends" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

/// delete from friends
export async function deleteFriend(req, reply) {
  console.log("WE IN MY DELETE FRIENDS");

  const { user_id, username } = req.body;

  const friend = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!friend) {
    return reply.code(404).send({ message: "NO such as friebd" });
  }
  try {
     const deleteFr = db
      .prepare(`DELETE FROM friends WHERE (user_id = ? AND friends_id = ?) OR (user_id = ? AND friends_id = ?)`)
      .run(user_id, friend.id, friend.id, user_id);
    return reply.code(200).send({ deleteFr });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}
