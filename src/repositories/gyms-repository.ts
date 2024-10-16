import { Gym, Prisma } from '@prisma/client'

export interface FetchNearbyGymsParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchManyGymsByTitle(query: string, page: number): Promise<Gym[]>
  fetchManyNearbyGyms(params: FetchNearbyGymsParams): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
}
