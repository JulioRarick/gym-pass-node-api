import { routes } from '@routes/router'
import fastify from 'fastify'

export const app = fastify()

app.register(routes)
