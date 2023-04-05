import { CheckIn } from '@prisma/client';
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistory } from './fetch-user-check-ins-history';

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistory
let _checkIns: CheckIn[]

const checkInDataOne = {
  gym_id: "gym_id_1",
  user_id: 'user_id_1',
}

const checkInDataTwo = {
  gym_id: "gym_id_2",
  user_id: 'user_id_1',
}

describe("Fetch User Check In History", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistory(checkInRepository)

    await checkInRepository.create(checkInDataOne)
    await checkInRepository.create(checkInDataTwo)

    const { checkIns } =  await sut.execute({ userId: "user_id_1"})

    _checkIns = checkIns
  })

  it("Should be able to fetch check in history", async() => {
    expect(_checkIns).toHaveLength(2)
    expect(_checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_id_1" }),
      expect.objectContaining({ gym_id: "gym_id_2" }),
    ])
  })

  it("Should be able to fetch paginated check in history", async() => {
    for(let i=0; i<22; i++) {
      await checkInRepository.create({
        gym_id: `gym_id_${i + 1}`,
        user_id: `user_id_2`,
      })
    }

    const { checkIns } =  await sut.execute({ userId: "user_id_2", page: 2 })
    console.log("checkIns", checkIns)
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_id_21" }),
      expect.objectContaining({ gym_id: "gym_id_22" }),
    ])
  })
})