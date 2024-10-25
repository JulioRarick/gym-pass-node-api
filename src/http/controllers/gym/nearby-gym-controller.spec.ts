import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate-user'

describe('Search Gym Controller', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })
  it('should be able to list nearby gyms', async () => {
    const { token } = await registerAndAuthenticateUser(app)

    for (let i = 1; i <= 3; i++) {
      await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Gym ${i}`,
          description: `Gym ${i} description`,
          phone: '123456789',
          latitude: -15.8272657,
          longitude: -48.0509952,
        })
    }

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript',
        description: 'Gym 01 description',
        phone: '123456789',
        latitude: Math.random() * 10,
        longitude: Math.random() * 10,
      })

    const queryGyms = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -15.8272654,
        longitude: -48.0509954,
      })

    expect(queryGyms.statusCode).toEqual(200)
    expect(queryGyms.body.gyms).toHaveLength(3)

    expect(queryGyms.body.gyms[0].title).toEqual('Gym 1')
  })
})
