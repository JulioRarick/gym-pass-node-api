import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

import { ResourceNotExistsError } from './error/resource-not-exists-error'

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

    checkIn.validated_at = new Date()

    await this.checkInsRepository.saveCheckIn(checkIn)

    return { checkIn }
  }
}
