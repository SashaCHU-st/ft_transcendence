import { sendMessage, getMessages } from "../controllers/messages.js";

async function messageRoutes(fastify) {
  fastify.post(
    "/messages",
    { preHandler: fastify.authenticate },
    sendMessage
  );
  fastify.get(
    "/messages",
    { preHandler: fastify.authenticate },
    getMessages
  );
}

export default messageRoutes;
