import { challengeSchema, notificationSchema, acceptSchema } from "../schema/challenge.schema.js";
import { challenge,notification,accept,decline } from "../controllers/challenge.js";
import { validatedValues } from "../utils/validate.js";


async function challengeRoutes(fastify) {
  fastify.post("/challenge", async (req, reply) => {
    const validated = challengeSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return challenge({ ...req, body: data }, reply);
  });

  fastify.post("/notification",async (req, reply) => {
    const validated = notificationSchema.safeParse(req.body);

    console.log("Incoming req.body:", req.body);
    console.log("Validation result:", validated);
    
    const data =await validatedValues(validated, reply);
    return notification({ ...req, body: data }, reply);
  });

  fastify.post("/acceptRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return accept({ ...req, body: data }, reply);
  });
  
  fastify.delete("/declineRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return decline({ ...req, body: data }, reply);
  });
}

export default challengeRoutes;
