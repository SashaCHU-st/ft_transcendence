import Fastify from "fastify";
import authRoutes from "./routes/AuthRoutes.js";
// import rootRoute from "./routes/rootRoute.js"

const fastify = Fastify({
  logger: true,
});
fastify.register(authRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
