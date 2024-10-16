import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History (use-case)', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )
  })

  it('should be able to return check-ins history of a user', async () => {
    const gym_01 = await checkInsRepository.create({
      gym_id: 'fake-gym-id-01',
      user_id: 'fake-user-id-01',
    })

    const gym_02 = await checkInsRepository.create({
      gym_id: 'fake-gym-id-02',
      user_id: 'fake-user-id-01',
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'fake-user-id-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym_01.gym_id,
      }),
      expect.objectContaining({
        gym_id: gym_02.gym_id,
      }),
    ])
  })

  it('should be able to fetch paginated check-ins history of a user', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: 'fake-user-id-01',
        gym_id: `fake-gym-id-${i}`,
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'fake-user-id-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'fake-gym-id-21',
      }),
      expect.objectContaining({
        gym_id: 'fake-gym-id-22',
      }),
    ])
  })
})
