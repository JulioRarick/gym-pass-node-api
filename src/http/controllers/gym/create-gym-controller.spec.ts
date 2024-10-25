import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate-user'

describe('Create Gym Controller', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await registerAndAuthenticateUser(app)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 01',
        description: 'Description Gym 01',
        phone: '123456789',
        latitude: Math.random(),
        longitude: Math.random(),
      })

    expect(response.statusCode).toEqual(201)
  })
})
