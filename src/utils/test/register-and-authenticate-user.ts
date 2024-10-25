import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function registerAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Julio Rarick',
    email: 'juliorarick@test.example',
    password: '123456',
  })
  const userAuthenticatedResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'juliorarick@test.example',
      password: '123456',
    })

  const { token } = userAuthenticatedResponse.body

  return {
    token,
  }
}
