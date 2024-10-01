import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { RegisterUseCase } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodyUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodyUserSchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(
      usersRepository
    )

    await registerUseCase.execute({
      email,
      name,
      password,
    })
  } catch (error) {
    return reply.status(400).send()
  }

  return reply.status(201).send()
}
