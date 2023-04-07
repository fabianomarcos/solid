import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface IValidateCheckInUseCaseRequest {
  checkInId: string
}

interface IValidateCheckInUseCase {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInUseCase> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    const maxMinutes = 20

    if (!checkIn) throw new ResourceNotFound()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minute'
    )

    if (distanceInMinutesFromCheckInCreation > maxMinutes)
      throw new LateCheckInValidationError()
    checkIn.validated_at = new Date()

    await this.checkInsRepository.update(checkIn)

    return { checkIn }
  }
}
