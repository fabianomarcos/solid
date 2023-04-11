import { Gym } from '@prisma/client'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase
let _gyms: Gym[]

const gym_01 = {
  id: 'fake_gym_id_1',
  title: 'title_gym_1',
  description: '',
  phone: '',
  latitude: -10.6523552,
  longitude: -33.953214,
}

const gym_02 = {
  id: 'fake_gym_id_2',
  title: 'title_gym_2',
  description: '',
  phone: '',
  latitude: -19.6523552,
  longitude: -43.953214,
}

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)

    await gymsRepository.create(gym_01)
    await gymsRepository.create(gym_02)

    const { gyms } = await sut.execute({ query: gym_01.title })

    _gyms = gyms
  })

  it('Should be able to search for gyms', async () => {
    expect(_gyms).toHaveLength(1)
    expect(_gyms).toEqual([expect.objectContaining({ title: gym_01.title })])
  })

  it('Should be able to fetch paginated search for gyms', async () => {
    // created 22 + 2 on beforeEach function
    for (let gy = 0; gy < 22; gy++) {
      await gymsRepository.create({
        ...gym_01,
        title: `title_gym_${gy + 3}`,
        id: `fake_gym_id_${gy + 3}`,
      })
    }

    const { gyms } = await sut.execute({
      query: 'title_gym',
      page: 2,
    })

    const { gyms: gyms2 } = await sut.execute({
      query: 'title_gym',
      page: 1,
    })

    expect(gyms).toHaveLength(4)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'title_gym_21' }),
      expect.objectContaining({ title: 'title_gym_22' }),
      expect.objectContaining({ title: 'title_gym_23' }),
      expect.objectContaining({ title: 'title_gym_24' }),
    ])
  })
})
