import { signup, login , logout} from "../controllers/auth.js";
import db from "../database/database.js";

async function authRoutes(fastify) {
  // Route for login
  fastify.post('/login', login);

  // Route for signup
  fastify.post('/signup', signup);  // Directly using signup function here

  // Route for logout (you can adjust this as needed)
  fastify.post('/logout', logout);

  ///for debug???? or delete later
  fastify.get("/users", async (req, reply) => {
    try {
      // Use better-sqlite3's prepare and all methods
      const rows = db.prepare("SELECT * FROM users").all();
  
      // console.log("!!!!", rows);
      return reply.code(200).send({ users: rows });
    } catch (err) {
      console.error("Error fetching users:", err.message);
      return reply.code(500).send({ message: "Failed to fetch users" });
    }
  });
}

export default authRoutes;
