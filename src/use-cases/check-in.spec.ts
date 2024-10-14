import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'
import { MaxCheckInsError } from './error/max-check-ins'
import { MaxDistanceError } from './error/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check In (use-case)', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()

    await gymsRepository.create({
      title: 'Fake Gym',
      description: 'Fake Gym Description',
      phone: '61999999999',
      latitude: -15.8272657,
      longitude: -48.0509952,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2024, 10, 10, 10, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'fake-user-id',
      gymId: 'fake-gym-id',
      userLatitude: -15.8272657,
      userLongitude: -48.0509952,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024, 10, 10, 10, 0, 0))

    await checkInUseCase.execute({
      userId: 'fake-user-id',
      gymId: 'fake-gym-id',
      userLatitude: -15.8272657,
      userLongitude: -48.0509952,
    })

    vi.setSystemTime(new Date(2024, 10, 10, 10, 0, 0))

    await expect(() =>
      checkInUseCase.execute({
        userId: 'fake-user-id',
        gymId: 'fake-gym-id',
        userLatitude: -15.8272657,
        userLongitude: -48.0509952,
      }),
    ).rejects.toBeInstanceOf(MaxCheckInsError)
  })

  it('should be able to check in twice but in different date', async () => {
    vi.setSystemTime(new Date(2024, 10, 10, 10, 0, 0))

    await checkInUseCase.execute({
      userId: 'fake-user-id',
      gymId: 'fake-gym-id',
      userLatitude: -15.8272657,
      userLongitude: -48.0509952,
    })

    vi.setSystemTime(new Date(2024, 10, 30, 10, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'fake-user-id',
      gymId: 'fake-gym-id',
      userLatitude: -15.8272657,
      userLongitude: -48.0509952,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'fake-gym-id-02',
      title: 'Fake Gym 02',
      description: 'Fake Gym 02 Description',
      phone: '61999999999',
      latitude: new Decimal(-15.7602023),
      longitude: new Decimal(-47.9483417),
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'fake-user-id',
        gymId: 'fake-gym-id-02',
        userLatitude: -15.8272657,
        userLongitude: -48.0509952,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
