import { CheckIn } from '@prisma/client';
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFound } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

const data = {
  gymId: "gymIdFake",
  userId: "userIdFake",
  userLatitude: -19.6523552,
  userLongitude: -43.953214,
}

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase
let _checkIn: CheckIn
let _createdCheckIn: CheckIn

const gym = {
  id: data.gymId,
  title: 'JavaScript Gym',
  description: '',
  phone: '',
  latitude: -19.6523552,
  longitude: -43.953214,
}

describe("Validate Check In Use Case", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 3, 8, 0, 0))

    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // 01/01/2023 16:40

    const createdCheckIn = await checkInRepository.create({
      gym_id: gym.id,
      user_id: data.userId
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    _checkIn = checkIn
    _createdCheckIn = createdCheckIn
  })

    it("Should be able to validate the check in", async() => {
      console.log('distanceInMinutesFromCheckInCreation: ', new Date());

      expect(_checkIn.validated_at).toEqual(new Date())
    })

    it("Should not be able to validate an inexistent check in", async() => {
      await expect(() => sut.execute({
        checkInId: "inexistent_check_in_id"
      })).rejects.toBeInstanceOf(ResourceNotFound)
    })

    it("Should not be able to validate the check in after 20 minutes of this creation", async() => {
      const twentyOneMinutesInMs = 1000 * 60 * 21
      vi.advanceTimersByTime(twentyOneMinutesInMs);

      await expect(() => sut.execute({
        checkInId: _createdCheckIn.id
      })).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
  })