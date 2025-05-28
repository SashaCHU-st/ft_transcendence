import { signup, login, logout, getCurrentUser } from "../controllers/auth.js";
import { allUsers } from "../controllers/users.js";
import {SignUpSchema, LoginSchema,LogoutSchema,} from "../schema/user.schema.js";
import { validatedValues } from "../utils/validate.js";

async function authRoutes(fastify) {
  fastify.post("/login", async (req, reply) => {
    const validated = LoginSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return login({ ...req, body: data }, reply);
  });

  fastify.post("/signup", async (req, reply) => {
    const validated = SignUpSchema.safeParse(req.body);
    const data = await validatedValues(validated, reply);
    return signup({ ...req, body: data }, reply);
  });

  fastify.post("/logout", async (req, reply) => {
    const validated = LogoutSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return logout({ ...req, body: data }, reply);
  });

  fastify.get("/users/me", { preHandler: fastify.authenticate },getCurrentUser);

  fastify.get("/users", allUsers);
}

export default authRoutes;
