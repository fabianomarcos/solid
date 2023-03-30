import { IUserRepository } from '@/repositories/IUserRepository';
import { User, Prisma } from "@prisma/client"

export class InMemoryUsersRepository implements IUserRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: "id",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user);

    return user

  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email);

    if (!user) return null

    return user
  }

  async findById(id: string): Promise<any> {
    const user = this.items.find(item => item.id === id);

    if (!user) return null

    return user
  }
}