import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const usersRepository = new PrismaCheckInsRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(usersRepository)

  return getUserMetricsUseCase
}
