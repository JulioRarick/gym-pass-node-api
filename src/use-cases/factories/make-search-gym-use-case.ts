import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { SearchGymsUseCase } from '../search-gym'

export function makeSearchGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymUseCase = new SearchGymsUseCase(gymsRepository)

  return searchGymUseCase
}
