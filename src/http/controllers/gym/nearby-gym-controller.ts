import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearbyGym(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query)

  const fetchNearbyGym = await makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGym.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  reply.status(200).send({
    gyms,
  })
}
