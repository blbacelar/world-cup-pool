import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/polls/count', async () => {
    const polls = await prisma.pool.count()
    return { count: polls }
  })

  await fastify.listen({port: 3333, host: '0.0.0.0'})
}

bootstrap()
