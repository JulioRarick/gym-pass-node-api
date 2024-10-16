import { authenticate } from '@controllers/authenticate-controller'
import { register } from '@controllers/register-controller'
import { FastifyInstance } from 'fastify'

import { profile } from '@/http/controllers/profile-controller'

import { verifyJWT } from '../hooks/verify-jwt'

export async function routes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
