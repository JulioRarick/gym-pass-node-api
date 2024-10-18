import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gym-use-case'

export async function searchGym(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymQuerySchema.parse(request.query)

  const searchGym = await makeSearchGymUseCase()

  const { gyms } = await searchGym.execute({ query, page })

  return reply.status(200).send({
    gyms,
  })
}
