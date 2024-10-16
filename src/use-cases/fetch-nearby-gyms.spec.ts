import { beforeEach, describe, expect, it } from 'vitest'

import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: GymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms (use-case)', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms (10 km)', async () => {
    await gymsRepository.create({
      title: 'Gym 1 (Near Gym)',
      description: 'Gym 1 description',
      phone: '123456789',
      latitude: -15.7913655,
      longitude: -48.0509952,
    })
    await gymsRepository.create({
      title: 'Gym 2 (Near Gym)',
      description: 'Gym 2 description',
      phone: '987654321',
      latitude: -15.8041667,
      longitude: -48.0165771,
    })
    await gymsRepository.create({
      title: 'Gym 3',
      description: 'Gym 3 description',
      phone: '123456789',
      latitude: -15.8075114,
      longitude: -47.8353456,
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -15.7913655,
      userLongitude: -48.0509952,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 1 (Near Gym)',
      }),
      expect.objectContaining({
        title: 'Gym 2 (Near Gym)',
      }),
    ])
  })
})
