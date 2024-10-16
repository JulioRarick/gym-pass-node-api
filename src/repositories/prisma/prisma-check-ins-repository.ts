import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findCheckInById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })

    return checkIn
  }

  async findByUserIdOnSameDay(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
      orderBy: { created_at: 'desc' },
    })

    return checkIns
  }

  async countCheckInsByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: { user_id: userId },
    })
    return count
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async saveCheckIn(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })

    return checkIn
  }
}
