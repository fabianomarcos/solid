import { PrismaUsersRepository } from './../repositories/prisma-users-repository';
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface IRgisterUserCaseRequest {
    name: string,
    email: string,
    password: string,
}

export async function registerUseCase({ email, name, password }: IRgisterUserCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({ where: { email }})

    if (userWithSameEmail) throw new Error(`Email alrealdy exist`)

    const prismaUsersRepository = new PrismaUsersRepository();

    await prismaUsersRepository.create({ name, email, password_hash });
}
