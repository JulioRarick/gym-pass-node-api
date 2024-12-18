import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })
  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckIn = await makeValidateCheckInUseCase()

  await validateCheckIn.execute({
    checkInId,
  })

  return reply.status(204).send()
}
