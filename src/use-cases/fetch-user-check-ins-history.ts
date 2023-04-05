import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';

interface IFetchUserRequest {
  userId: string
  page?: number
}

interface IFetchUserResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistory {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({ userId, page = 1 }: IFetchUserRequest): Promise<IFetchUserResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)
    return { checkIns }
  }
}