import { CheckIn, Prisma } from "@prisma/client"
import { randomUUID } from 'node:crypto';
import { ICheckInsRepository } from '../check-ins-repository';
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay =  dayjs(date).startOf("date")
    const endOfTheDay =  dayjs(date).endOf("date")

    const checkInOnSameDate = this.items.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        (checkInDate.isSame(startOfTheDay) || checkInDate.isAfter(startOfTheDay)) &&
        checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      ...data,
      id: randomUUID(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn);

    return checkIn
  }

  async findManyByUserId(userId: string, page = 1): Promise<CheckIn[]> {
    const indexPage = page - 1
    const totalPerPage = 20

    return this.items
      .filter(checkIn => checkIn.user_id === userId)
      .slice(indexPage * totalPerPage, page * totalPerPage)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items
      .filter(checkIn => checkIn.user_id === userId)
      .length
  }
}