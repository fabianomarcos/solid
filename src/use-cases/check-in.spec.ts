import { CheckIn } from '@prisma/client';
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe("Check In Use Case", () => {
  const data = {
    gymId: "gymIdFake",
    userId: "userIdFake",
    userLatitude: -19.6523552,
    userLongitude: -43.953214,
  }

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

    gymRepository = new InMemoryGymsRepository()
    gymRepository.items.push({
      id: data.gymId,
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    const { checkIn } =  await sut.execute(data)

    _checkIn = checkIn
  })

  it("Should be able to check in", async() => {
    expect(_checkIn.id).toEqual(expect.any(String))
  })

  it.only("Should not be able to check in in twice the same day", async() => {
    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(Error)
  })

  it("Should not be able to check in in twice the same day", async() => {
    vi.setSystemTime(new Date(2023, 3, 9, 0, 0))

    const { checkIn } = await sut.execute(data)

    expect(checkIn.id).toEqual(expect.any(String))
  })
})