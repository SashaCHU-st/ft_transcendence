import { signup, login , logout} from "../controllers/auth.js";
import db from "../database/database.js";

async function authRoutes(fastify) {
  fastify.post('/login', login);

  fastify.post('/signup', signup);

  fastify.post('/logout', logout);

  ///for debug???? or delete later
  fastify.get("/users", async (req, reply) => {
    try {
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
