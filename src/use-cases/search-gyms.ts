import { IGymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface ISearchGymsRequest {
  query: string
  page?: number
}

interface ISearchGymsResponse {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page = 1,
  }: ISearchGymsRequest): Promise<ISearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return { gyms }
  }
}