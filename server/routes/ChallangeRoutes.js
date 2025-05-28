import { challengeSchema, notificationSchema, acceptSchema } from "../schema/challenge.schema.js";
import { challenge,notification,accept,decline } from "../controllers/challenge.js";
async function challengeRoutes(fastify) {
  fastify.post("/challenge", async (req, reply) => {
    const validated = challengeSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return challenge({ ...req, body: validated.data }, reply);
  });

  fastify.post("/notification",async (req, reply) => {
    const validated = notificationSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return notification({ ...req, body: validated.data }, reply);
  });

  fastify.post("/acceptRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return accept({ ...req, body: validated.data }, reply);
  });
  fastify.delete("/declineRequest",async (req, reply) => {
    const validated = acceptSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message:validated.error.errors[0].message ,
      });
    }
    return decline({ ...req, body: validated.data }, reply);
  });
}

export default challengeRoutes;
