import Fastify from "fastify";
import authRoutes from "./routes/AuthRoutes.js";
// import friendsRoutes from "./routes/FriendsRoutes.js"
import favoriteRoutes from "./routes/FavoritesRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import statisticsRoutes from "./routes/StatisticRoutes.js";
import challengeRoutes from "./routes/ChallangeRoutes.js";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import jwt from "@fastify/jwt";
import fs from "fs";
import path from "path";

dotenv.config();

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.resolve("cert", "key.pem")),
    cert: fs.readFileSync(path.resolve("cert", "cert.pem")),
  },
});
////ldijjhcdjkhbdjkdhbdjkhbdcjkh
// JWT
fastify.register(jwt, { secret: "kuku" });

fastify.addHook("preHandler", (req, res, next) => {
  req.jwt = fastify.jwt;
  return next();
});

// JWT Authentication
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ message: "Unauthorized" });
  }
});

// CORS
fastify.register(cors, {
  origin: "https://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
});

// Routes
fastify.register(authRoutes);
// fastify.register(friendsRoutes);
fastify.register(favoriteRoutes);
fastify.register(profileRoutes);
fastify.register(statisticsRoutes);
fastify.register(challengeRoutes);

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
