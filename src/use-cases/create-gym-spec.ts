import { beforeEach, describe, expect, it } from 'vitest'

import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymUseCase } from './create-gym'

let gymsRepository: GymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym (use-case)', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to create a gym', async () => {
    const { gym } = await createGymUseCase.execute({
      id: 'fake-gym-id-01',
      title: 'Fake Gym',
      description: 'Description of Fake Gym',
      phone: '123456789',
      latitude: -23.5505199,
      longitude: -46.6333094,
    })

    expect(gym.title).toEqual('Fake Gym')
  })
})
