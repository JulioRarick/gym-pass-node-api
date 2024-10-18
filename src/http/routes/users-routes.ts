import { FastifyInstance } from 'fastify'

import { authenticate } from '@/http/controllers/users/authenticate-controller'
import { profile } from '@/http/controllers/users/profile-controller'
import { register } from '@/http/controllers/users/register-controller'

import { verifyJWT } from '../hooks/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
