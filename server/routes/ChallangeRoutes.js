import { challengeSchema, notificationSchema, acceptSchema, challengeStatsParamsSchema } from "../schema/challenge.schema.js";
import { challenge,notification,accept,decline, getChallengeStats } from "../controllers/challenge.js";
import { validatedValues } from "../utils/validate.js";


async function challengeRoutes(fastify) {
  fastify.post("/challenge", async (req, reply) => {
    const validated = challengeSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return challenge({ ...req, body: data }, reply);
  });

  fastify.post("/notification",async (req, reply) => {
    const validated = notificationSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return notification({ ...req, body: data }, reply);
  });

  fastify.post("/acceptRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return accept({ ...req, body: data }, reply);
  });
  
  fastify.post("/declineRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return decline({ ...req, body: data }, reply);
  });
  // fastify.post("/sawAccept",async (req, reply) => {
  //   const validated = acceptSchema.safeParse(req.body);
  //   const data =await validatedValues(validated, reply);
  //   return sawAccept({ ...req, body: data }, reply);
  // });

  fastify.get("/challenge-stats/:user_id", async (req, reply) => {
    const validated = challengeStatsParamsSchema.safeParse({
      user_id: Number(req.params.user_id),
    });
    const data = await validatedValues(validated, reply);
    return getChallengeStats({ ...req, params: data }, reply);
  });
}

export default challengeRoutes;
