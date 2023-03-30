import { IUser } from '@/interfaces/types';
import { IUserRepository } from '@/repositories/IUserRepository';
import { ResourceNotFound } from './errors/resource-not-found-error';

interface IAGetUserProfileUseCaseRequest {
  userId: string
}

interface IGetUserProfileUseCase {
  user: IUser
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ userId }: IAGetUserProfileUseCaseRequest):  Promise<IGetUserProfileUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFound()

    return { user }
  }
}