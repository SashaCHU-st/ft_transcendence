import { signup, login, logout, getCurrentUser } from "../controllers/auth.js";
import { allUsers } from "../controllers/users.js";
import db from "../database/database.js";
import {SignUpSchema, LoginSchema,LogoutSchema,} from "../schema/user.schema.js";

async function authRoutes(fastify) {
  fastify.post("/login", async (req, reply) => {
    const validated = LoginSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return login({ ...req, body: validated.data }, reply);
  });

  fastify.post("/signup", async (req, reply) => {
    const validated = SignUpSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message,
      });
    }
    return signup({ ...req, body: validated.data }, reply);
  });

  fastify.post("/logout", async (req, reply) => {
    const validated = LogoutSchema.safeParse(req.body);

    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return logout({ ...req, body: validated.data }, reply);
  });

  fastify.get("/users/me", { preHandler: fastify.authenticate },getCurrentUser);

  fastify.get("/users", allUsers);
}

export default authRoutes;
