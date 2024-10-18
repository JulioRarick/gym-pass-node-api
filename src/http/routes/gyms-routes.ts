import { createGym } from '@controllers/gym/create-gym-controller'
import { nearbyGym } from '@controllers/gym/nearby-gym-controller'
import { searchGym } from '@controllers/gym/search-gym-controller'
import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../hooks/verify-jwt'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', createGym)

  app.get('/gyms/search', searchGym)
  app.get('/gyms/nearby', nearbyGym)
}
