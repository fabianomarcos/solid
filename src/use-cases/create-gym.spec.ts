import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { Gym } from '@prisma/client'

let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
let _gym: Gym

describe('Create Gym Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)

    const { gym } = await sut.execute({
      description: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      title: 'Gym Academy',
    })

    _gym = gym
  })

  it('should to create gym', async () => {
    expect(_gym.id).toEqual(expect.any(String))
  })
})
