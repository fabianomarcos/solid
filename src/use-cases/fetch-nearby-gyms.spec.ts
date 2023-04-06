import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { Gym } from '@prisma/client';
import { FetchNearbyGymsUseCase, IFetchNearbyGymsRequest } from './fetch-nearby-gyms';


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
let _gyms: Gym[]

const gym_01 = {
  id: "fake_gym_id_1",
  title: 'title_gym_1',
  description: '',
  phone: '',
  latitude: -10.6523552,
  longitude: -33.953214,
}

const gym_02 = {
  id: "fake_gym_id_2",
  title: 'title_gym_2',
  description: '',
  phone: '',
  latitude: -19.6523552,
  longitude: -43.953214,
}

describe("Fetch Nearby Gym Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    await gymsRepository.create(gym_01)
    await gymsRepository.create(gym_02)

    const { gyms } =  await sut.execute({
      userLatitude: -10.6523552,
      userLongitude: -33.953214,
    } as IFetchNearbyGymsRequest)

    _gyms = gyms
  })

  it("Should be able to fetch nearby gyms", async() => {
    expect(_gyms).toHaveLength(1)
    expect(_gyms).toEqual([expect.objectContaining({ title: gym_01.title })])
  })

  it("Should be able to fetch nearby gyms", async() => {
    await gymsRepository.create({
      ...gym_01,
      id: "fake_gym_id_3",
      title: 'title_gym_3',
      latitude: -10.6523551,
      longitude: -33.953213,
    })

    const { gyms } =  await sut.execute({
      userLatitude: -10.6523552,
      userLongitude: -33.953214,
    } as IFetchNearbyGymsRequest)

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: gym_01.title }),
      expect.objectContaining({ title: 'title_gym_3' }),
    ])
  })
})