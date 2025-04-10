import { signup } from "../controllers/auth.js";
import db from "../database/database.js";

async function authRoutes(fastify) {
  // Route for login
  fastify.post('/login', async (req, reply) => {
    return { message: "LOGIN" };
  });

  // Route for signup
  fastify.post('/signup', signup);  // Directly using signup function here

  // Route for logout (you can adjust this as needed)
  fastify.get('/', async (req, reply) => {
    return { message: "LOGOUT" };
  });

  // Route to fetch all users
  fastify.get("/users", async (req, reply) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      console.log("!!!!", rows)
      return reply.code(200).send({ users: rows });
    } catch (err) {
      console.error("Error fetching users:", err.message);
      return reply.code(500).send({ message: "Failed to fetch users" });
    }
  });
}

export default authRoutes;
