import { IUserRepository } from '@/repositories/user-repository';
import { User, Prisma } from "@prisma/client"
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements IUserRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
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