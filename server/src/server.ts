import cors from "@fastify/cors";
import jwt from '@fastify/jwt';
import Fastify from "fastify";
require("dotenv").config();

import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessesRoute } from "./routes/guesses";
import { pollRoutes } from "./routes/polls";
import { userRoutes } from "./routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true,
  })

  const secret = process.env["JWT_SECRET"]

  await fastify.register(jwt, {
    secret: "secret"
  })

  await fastify.register(pollRoutes)
  await fastify.register(userRoutes)
  await fastify.register(guessesRoute)
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)

  await fastify.listen({port: 3333, host: '0.0.0.0'})
}

bootstrap()
