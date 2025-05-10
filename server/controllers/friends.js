import db from "../database/database.js";

export async function friendsSearch(req, reply) {
  console.log("WE ARE IN FRIENDS");

  const { username } = req.body;
  
  if(!username)
        return reply.code(400).send({message: "PLease fill in frien username"})

  try
  {
    const hasUser = db.prepare("SELECT * FROM users WHERE username = ? ").get(username);
    console.log("THERE is such username",hasUser);
    if(!hasUser)
    {
        return reply.code(400).send({ message: "Not such user" });
    }
    if(hasUser)
    {
        console.log("KUKU, lets add display user");
        return reply.code(200).send({ message: "we have this user", hasUser });
    }

  }catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}     

export async function friendsAdd(req, reply) {
    console.log("WE ARE IN ADDING FRIENDS");
  
    const {id, username } = req.body;
    
    if(!username || !id)
          return reply.code(400).send({message: "PLease fill in friend username"})
  
    try
    {
      const hasUser = db.prepare("SELECT * FROM users WHERE username = ? ").get(username);
      console.log("THERE is such username",hasUser);
      if(!hasUser)
      {
          return reply.code(400).send({ message: "Not such user" });
      }
      if(hasUser)
      {
          console.log("KUKU, lets add display user");
          return reply.code(200).send({ message: "we have this user", hasUser });
      }
  
    }catch (err) {
      console.error("Database error:", err.message);
      return reply.code(500).send({ message: "Something went wrong" });
    }
  }
  
