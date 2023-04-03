import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from "vitest"

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFound } from './errors/resource-not-found-error';

describe("GetUserProfile Use Case", () => {
  const email = "jonhdoe@example.com"
  const name = "John Doe"
  const password = "password"

  let userRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase
  let _user: User

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(userRepository)

    const createdUser = await userRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    _user = createdUser
  })

  it("Should be able to get user profile", async() => {
    const { user } =  await sut.execute({
      userId: _user.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(name)
    expect(user.email).toEqual(email)
  })

  it("Should not be able to get user profile with wrong id", async() => {
    await expect(() => sut.execute({
      userId: "fake_user_id"
    })).rejects.toBeInstanceOf(ResourceNotFound)
  })
})