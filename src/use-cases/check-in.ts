import { CheckIn } from "@prisma/client"

import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { IGymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

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
    userId,
    userLatitude,
    userLongitude
  }: ICheckInUseCaseRequest):  Promise<ICheckInUseCase> {
    const maxDistanceInKilometers = 0.1;
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFound()

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    )


    if (distance > maxDistanceInKilometers) throw new Error()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) throw new Error()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return { checkIn }
  }
}