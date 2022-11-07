import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from '../lib/prisma';
import { authenticate } from "../plugins/authenticate";

export async function guessesRoute(fastify: FastifyInstance){
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()
    return { count }
  })

  fastify.post('/polls/:pollId/games/:gameId/guesses',{onRequest: [authenticate]}, async (request, response) => {
    const createGuessParam = z.object({
      pollId: z.string(),
      gameId: z.string()
    })

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number()
    })

    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)
    const { pollId, gameId } = createGuessParam.parse(request.params)

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId: pollId,
          userId: request.user.sub
        }
      }
    })

    if(!participant){
      return response.status(400).send({
        message: `You're not allowed to create a guess in this poll.`
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId
        }
      }
    })

    if(guess){
      return response.status(400).send({
        message: `You've already sent a guess to this game on this poll`
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if(!game){
      return response.status(400).send({
        message: 'Game not found'
      })
    }

    if(game.date < new Date()) {
      return response.status(400).send({
        message: `You can't send guesses after the game is finished.`
      })
    }

    await prisma.guess.create({
      data:{
        gameId,
        participantId: participant.id,
        firstTeamPoints,
        secondTeamPoints
      }
    })

    return response.status(201).send()
  })
}
