import Fastify from "fastify";
import authRoutes from "./routes/AuthRoutes.js";
// import friendsRoutes from "./routes/FriendsRoutes.js"
import favoriteRoutes from "./routes/FavoritesRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import statisticsRoutes from "./routes/StatisticRoutes.js";
import challengeRoutes from "./routes/ChallangeRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import { initWsServer } from "./remote/wsServer.js";
import { initChatWsServer } from "./chatWsServer.js";
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
fastify.register(messageRoutes);

// Server start
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    const gameWss = initWsServer();
    const chatWss = initChatWsServer();

    fastify.server.on('upgrade', (req, socket, head) => {
      const pathname = req.url.split('?')[0];
      if (pathname === '/ws') {
        gameWss.handleUpgrade(req, socket, head, ws => {
          gameWss.emit('connection', ws, req);
        });
      } else if (pathname === '/chat') {
        chatWss.handleUpgrade(req, socket, head, ws => {
          chatWss.emit('connection', ws, req);
        });
      }
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
