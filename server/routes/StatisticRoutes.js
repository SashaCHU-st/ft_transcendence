import { statisticsSchema, winSchema } from "../schema/statisticSchema.js";
import { statisticsAll, statisticsUser, win, loseUser } from "../controllers/statistics.js";


async function statistics(fastify) {
  fastify.get("/statistics",statisticsAll);
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

  fastify.post("/winUser", async (req, reply) => {
    const validated = winSchema.safeParse(req.body);

    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return win({ ...req, body: validated.data }, reply);
  });
  fastify.post("/loseUser", async (req, reply) => {
    const validated = winSchema.safeParse(req.body);

    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return loseUser({ ...req, body: validated.data }, reply);
  });
}

export default statistics;
