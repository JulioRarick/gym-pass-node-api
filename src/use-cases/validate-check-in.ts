import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

import { ResourceNotExistsError } from './error/resource-not-exists-error'
import { TimeExpirationValidateCheckIn } from './error/time-expiration-validate-check-in'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findCheckInById(checkInId)

    if (!checkIn) {
      throw new ResourceNotExistsError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minute',
    )

    if (distanceInMinutesFromCheckInCreation > 30) {
      throw new TimeExpirationValidateCheckIn()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.saveCheckIn(checkIn)

    return { checkIn }
  }
}
