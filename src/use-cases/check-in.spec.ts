import { CheckIn } from '@prisma/client';
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

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

const gym = {
  id: data.gymId,
  title: 'JavaScript Gym',
  description: '',
  phone: '',
  latitude: new Decimal(-19.6523552),
  longitude: new Decimal(-43.953214),
}

describe("Check In Use Case", () => {

  afterEach(() => {
    vi.useRealTimers()
  })

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 3, 8, 0, 0))

    gymRepository = new InMemoryGymsRepository()
    gymRepository.items.push(gym)

    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    const { checkIn } =  await sut.execute(data)

    _checkIn = checkIn
  })

  it("Should be able to check in", async() => {
    expect(_checkIn.id).toEqual(expect.any(String))
  })

  it("Should not be able to check in in twice the same day", async() => {
    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(Error)
  })

  it("Should not be able to check in in twice the same day", async() => {
    vi.setSystemTime(new Date(2023, 3, 9, 0, 0))

    const { checkIn } = await sut.execute(data)

    expect(checkIn.id).toEqual(expect.any(String))
  })
})

describe("Check In Use Case with different gym ids ", () => {
  it("Should not be able to check in on distant gym", async() => {
    const newGym = {
      id: "fakeGymId_2",
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    }

    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    gymRepository.items.push(gym)
    gymRepository.items.push(newGym)

    await sut.execute(data)

    await expect(sut.execute({
      ...data,
      gymId: newGym.id,
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })).rejects.toBeInstanceOf(Error)
  })
})