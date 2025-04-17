import { signup, login, logout } from "../controllers/auth.js";
import db from "../database/database.js";
import { SignUpSchema, LoginSchema} from "../schema/user.schema.js";

async function authRoutes(fastify) {
  fastify.post("/login", async (req, reply) =>
  {
    const validated = LoginSchema.safeParse(req.body);
    if(!validated.success)
    {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return login ({...req, body:validated.data}, reply);
  });

  fastify.post("/signup", async (req, reply) => {
    const validated = SignUpSchema.safeParse(req.body);

    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return signup({...req, body:validated.data}, reply);
  });

  fastify.post("/logout", logout);

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
