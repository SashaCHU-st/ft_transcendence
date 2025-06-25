import {
  statisticsSchema,
  winSchema,
  opponentStatsParamsSchema,
} from "../schema/statisticSchema.js";
import {
  statisticsAll,
  statisticsUser,
  win,
  loseUser,
  opponentStats,
} from "../controllers/statistics.js";
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

  fastify.get("/opponent-stats/:user_id", async (req, reply) => {
    const validated = opponentStatsParamsSchema.safeParse({
      user_id: Number(req.params.user_id),
    });
    const data = await validatedValues(validated, reply);
    return opponentStats({ ...req, params: data }, reply);
  });
}

export default statistics;
