import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function getHistoryCheckIns(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getHistoryCheckInsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = getHistoryCheckInsSchema.parse(request.query)

  const getHistoryCheckIns = await makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await getHistoryCheckIns.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
