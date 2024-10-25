import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate-user'

describe('Create Check In Controller', () => {
  beforeEach(async () => {
    await app.ready()
  })
  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a new check in for a user', async () => {
    const { token } = await registerAndAuthenticateUser(app)
    const gym = await prisma.gym.create({
      data: {
        title: 'Gym 1',
        latitude: -15.8272654,
        longitude: -48.0509954,
      },
    })
    const newCheckIn = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.8272654,
        longitude: -48.0509954,
      })

    expect(newCheckIn.statusCode).toEqual(201)
  })
})
