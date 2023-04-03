import { IUserRepository } from '../user-repository';
import { prisma } from "@/lib/prisma"
import { Prisma, User } from "@prisma/client"

export class PrismaUsersRepository implements IUserRepository {
    async  findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email }})
        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({ data })
        return user;
    }
}