import { CheckIn } from "@prisma/client"

import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { IGymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInUseCase {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
    ) {}

  async execute({
    gymId,
    userId
  }: ICheckInUseCaseRequest):  Promise<ICheckInUseCase> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFound()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    console.log('checkInOnSameDay: ', checkInOnSameDay);
    if (checkInOnSameDay) throw new Error()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return { checkIn }
  }
}