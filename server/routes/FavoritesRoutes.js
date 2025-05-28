import { favoritesSchema } from "../schema/favorites.schema.js";
import { addfavorites, favorites, deletefavorites } from "../controllers/favorites.js";

async function favoriteRoutes(fastify) {
  fastify.post("/addfavorites", async (req, reply) => {
    console.log("Received request:", req.body);
    const validated = favoritesSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return addfavorites({ ...req, body: validated.data }, reply);
  });
    fastify.get("/favorites", favorites);

    fastify.delete("/deletefavorites", async (req, reply) => {
    const validated = favoritesSchema.safeParse(req.body);
    // const data =await validatedValues(validated, reply);
    // if (!data) return;

    if (!validated.success) {
    return reply.code(400).send({
      message: "Validation error",
      errors: validated.error.errors,
    });
  }
    return deletefavorites({ ...req, body: validated.data }, reply);
    });
}

export default favoriteRoutes;
