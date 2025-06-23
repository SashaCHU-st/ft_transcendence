import { statisticsSchema, winSchema, aiResultSchema } from "../schema/statisticSchema.js";
import { statisticsAll, statisticsUser, win, loseUser, aiResult } from "../controllers/statistics.js";
import { validatedValues } from "../utils/validate.js";

async function statistics(fastify) {
  fastify.get("/statistics",statisticsAll);
  fastify.post("/statisticsUser", async (req, reply) => {
    const validated = statisticsSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return statisticsUser({ ...req, body: data }, reply);
  });

  fastify.post("/winUser", async (req, reply) => {
    const validated = winSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return win({ ...req, body: data }, reply);
  });
  fastify.post("/loseUser", async (req, reply) => {
    const validated = winSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return loseUser({ ...req, body: data }, reply);
  });

  fastify.post("/aiResult", async (req, reply) => {
    const validated = aiResultSchema.safeParse(req.body);
    const data = await validatedValues(validated, reply);
    return aiResult({ ...req, body: data }, reply);
  });
}

export default statistics;
