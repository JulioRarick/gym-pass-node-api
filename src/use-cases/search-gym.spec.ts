import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gym'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gym (use-case)', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to return paginated gyms that match the query', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      description: 'Description 1',
      phone: 'Phone 1',
      latitude: Math.random(),
      longitude: Math.random(),
    })

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Gym 1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })

  it('should be able to return paginated gyms before search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: `Description ${i}`,
        phone: `Phone ${i}`,
        latitude: Math.random(),
        longitude: Math.random(),
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
