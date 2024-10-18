import fastifyJwt from '@fastify/jwt'
import { userRoutes } from '@routes/users-routes'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { checkInsRoutes } from './http/routes/check-ins-routes'
import { gymRoutes } from './http/routes/gyms-routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.errors })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
