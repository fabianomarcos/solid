import { CheckIn } from '@prisma/client';
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe("Check In Use Case", () => {
  const gymId = "gymIdFake"
  const userId = "userIdFake"

  let checkInRepository: InMemoryCheckInsRepository
  let gymRepository: InMemoryGymsRepository
  let sut: CheckInUseCase
  let _checkIn: CheckIn

  afterEach(() => {
    vi.useRealTimers()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 3, 8, 0, 0))
    checkInRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    gymRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    const { checkIn } =  await sut.execute({
      gymId,
      userId,
      userLatitude: -19.6523552,
      userLongitude: -43.953214,
    })

    _checkIn = checkIn
  })

  it("Should be able to check in", async() => {
    expect(_checkIn.id).toEqual(expect.any(String))
  })

  it("Should not be able to check in in twice the same day", async() => {
    await expect(() => sut.execute({
      gymId,
      userId
    })).rejects.toBeInstanceOf(Error)
  })

  it("Should not be able to check in in twice the same day", async() => {
    vi.setSystemTime(new Date(2023, 3, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId,
      userId
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})