import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { ResourceNotExistsError } from './error/resource-not-exists-error'
import { TimeExpirationValidateCheckIn } from './error/time-expiration-validate-check-in'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check-in (use-case)', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
    const notValidatedCheckIn = await checkInsRepository.create({
      user_id: 'fake-user-id',
      gym_id: 'fake-gym-id',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: notValidatedCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    )
  })
  it('should not be able to validate inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'fake-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotExistsError)
  })
  it('should not be able to validate a check-in after 30 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 1, 1, 12, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'fake-user-id',
      gym_id: 'fake-gym-id',
    })

    const thirtyOneMinutesInMilliseconds = 31 * 60 * 1000
    vi.advanceTimersByTime(thirtyOneMinutesInMilliseconds)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(TimeExpirationValidateCheckIn)
  })
})
