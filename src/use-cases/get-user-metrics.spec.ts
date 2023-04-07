import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsHistory } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsHistory
let _checkInsCount: number

const checkInDataOne = {
  gym_id: 'gym_id_1',
  user_id: 'user_id_1',
}

const checkInDataTwo = {
  gym_id: 'gym_id_2',
  user_id: 'user_id_1',
}

describe('Get User Metrics', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsHistory(checkInRepository)

    await checkInRepository.create(checkInDataOne)
    await checkInRepository.create(checkInDataTwo)

    const { checkInsCount } = await sut.execute({ userId: 'user_id_1' })

    _checkInsCount = checkInsCount
  })

  it('Should be able to get check in count from metrics', async () => {
    expect(_checkInsCount).toEqual(2)
  })
})
