import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function getMetricsCheckIns(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMetricsCheckIns = await makeGetUserMetricsUseCase()

  const { countCheckIns } = await getMetricsCheckIns.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    countCheckIns,
  })
}
