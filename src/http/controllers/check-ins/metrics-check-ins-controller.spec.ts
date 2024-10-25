import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate-user'

describe('Metrics Check-Ins Controller', () => {
  beforeEach(async () => {
    await app.ready()
  })
  afterEach(async () => {
    await app.close()
  })

  it('should be able to get metrics user check ins', async () => {
    const { token } = await registerAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()
    const gym = await prisma.gym.create({
      data: {
        title: 'Gym 1',
        latitude: -15.8272654,
        longitude: -48.0509954,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    })

    const metricsCheckIns = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(metricsCheckIns.statusCode).toEqual(200)
    expect(metricsCheckIns.body.countCheckIns).toEqual(3)
  })
})
