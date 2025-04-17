import Fastify from "fastify";
import authRoutes from "./routes/AuthRoutes.js";
import friendsRoutes from "./routes/FriendsRoutes.js"
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import jwt from '@fastify/jwt';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// JWT
fastify.register(jwt, { secret: 'kuku' });

fastify.addHook('preHandler', (req, res, next) => {
  req.jwt = fastify.jwt;
  next();
});

// CORS
await fastify.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
});

// Routes
fastify.register(authRoutes);
fastify.register(friendsRoutes);

// Server start
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
