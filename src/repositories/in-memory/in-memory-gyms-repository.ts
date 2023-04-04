import { IGymsRepository } from '@/repositories/gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      ...data,
      id: data.id ?? randomUUID(),
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString())
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(item => item.id === id)

    if (!gym) return null

    return gym
  }
}