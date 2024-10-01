import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseParams {
  email: string
  name: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ email, name, password }: RegisterUseCaseParams) {
    const password_hash = await bcrypt.hash(password, 6)

    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (emailAlreadyExists) {
      throw new Error('Email already exists')
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
