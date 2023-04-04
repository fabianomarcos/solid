import { IGymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface ICreateGymRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: IGymsRepository) {}

  async execute(data: ICreateGymRequest): Promise<ICreateGymResponse> {
    const gym = await this.gymRepository.create({
      ...data,
      phone: data.phone || "",
    })

    return { gym }
  }
}