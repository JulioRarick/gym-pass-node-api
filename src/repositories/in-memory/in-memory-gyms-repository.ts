import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { FetchNearbyGymsParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []
  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async searchManyGymsByTitle(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async fetchManyNearbyGyms(params: FetchNearbyGymsParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }
    return gym
  }
}
