import { IUserRepository } from '@/repositories/user-repository'
import { ResourceNotFound } from './errors/resource-not-found-error'
import { User } from '@prisma/client'

interface IAGetUserProfileUseCaseRequest {
  userId: string
}

interface IGetUserProfileUseCase {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({
    userId,
  }: IAGetUserProfileUseCaseRequest): Promise<IGetUserProfileUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFound()

    return { user }
  }
}
