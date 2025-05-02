import { statisticsSchema } from "../schema/statisticSchema.js";
import { statisticsAll, statisticsUser } from "../controllers/statistics.js";


async function statistics(fastify) {
  fastify.get("/statistics", async (reply) => {
    return statisticsAll(reply);
  });
  fastify.post("/statisticsUser", async (req, reply) => {
    const validated = statisticsSchema.safeParse(req.body);

    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return statisticsUser({ ...req, body: validated.data }, reply);
  });
}

export default statistics;
