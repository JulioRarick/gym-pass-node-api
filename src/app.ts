import fastifyJwt from '@fastify/jwt'
import { routes } from '@routes/router'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(routes)

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
