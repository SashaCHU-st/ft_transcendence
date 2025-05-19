import { favoritesSchema } from "../schema/favorites.schema.js";
import { addfavorites } from "../controllers/favorites.js";

async function favoriteRoutes(fastify) {
  fastify.post("/addfavorites", async (req, reply) => {
    const validated = favoritesSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return addfavorites({ ...req, body: validated.data }, reply);
  });
}

export default favoriteRoutes;
