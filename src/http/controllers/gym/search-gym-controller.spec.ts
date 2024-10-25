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
  it('should be able to search gym by query', async () => {
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
        latitude: -15.8272657,
        longitude: -48.0509952,
      })

    const queryGym = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        query: 'Gym 1',
      })

    console.log(queryGym.body.gyms)

    expect(queryGym.statusCode).toEqual(200)
    expect(queryGym.body.gyms.length).toEqual(1)

    expect(queryGym.body.gyms[0].title).toEqual('Gym 1')
  })
})
