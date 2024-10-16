import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findCheckInById(id: string): Promise<CheckIn | null>
  findByUserIdOnSameDay(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countCheckInsByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  saveCheckIn(checkIn: CheckIn): Promise<CheckIn>
}
