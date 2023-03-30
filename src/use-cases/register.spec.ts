import { IUserAuthenticated } from '@/interfaces/types';
import { compare } from 'bcryptjs';
import { expect, describe, it, beforeEach } from "vitest"

import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe("Register Use Case", () => {
  const email = "jonhdoe@example.com"
  const name = "John Doe"
  const password = "password"

  let userRepository: InMemoryUsersRepository
  let registerUseCase: RegisterUseCase
  let _user: IUserAuthenticated

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(userRepository)

    const { user } =  await registerUseCase.execute({
      name,
      email,
      password
    })

    _user = user
  })

  it("Should hash user password upon registration", async() => {
    const isPasswordCorrectlyHashed = await compare("password", _user.password_hash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("Should not be able to register with same email", async() => {
    await expect(() => registerUseCase.execute({
      name,
      email,
      password
    })).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it("Should be able to register", async() => {
    expect(_user.id).toEqual(expect.any(String))
  })
})