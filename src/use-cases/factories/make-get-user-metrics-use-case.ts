import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsHistory } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsHistory(checkInsRepository)
  return useCase
}