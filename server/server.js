import Fastify from "fastify";
import authRoutes from "./routes/AuthRoutes.js";
import cors from '@fastify/cors';
import dotenv from 'dotenv';
// import rootRoute from "./routes/rootRoute.js"

const fastify = Fastify({
  logger: true,
});
fastify.register(authRoutes);
await fastify.register(cors, {
  origin: 'http://localhost:5173', 
  credentials: true               
});
// await fastify.register(cors, { origin: true });

const start = async () => {
  try {
    await fastify.listen({ port: 3000  || process.env.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
