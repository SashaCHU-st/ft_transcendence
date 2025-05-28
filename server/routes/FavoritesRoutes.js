import { favoritesSchema } from "../schema/favorites.schema.js";
import { addfavorites, deletefavorites } from "../controllers/favorites.js";
import { validatedValues } from "../utils/validate.js";

async function favoriteRoutes(fastify) {
  fastify.post("/addfavorites", async (req, reply) => {
    const validated = favoritesSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return addfavorites({ ...req, body: data }, reply);
  });

    fastify.delete("/deletefavorites", async (req, reply) => {
    const validated = favoritesSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return deletefavorites({ ...req, body: data }, reply);
  });
}

export default favoriteRoutes;
