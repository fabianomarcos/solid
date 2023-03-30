import { compare } from 'bcryptjs';
import { expect, describe, it } from "vitest"

import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe("Register Use Case", () => {
  const email = "jonhdoe@example.com"
  const name = "John Doe"
  const password = "password"

  it("Should hash user password upon registration", async() => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } =  await registerUseCase.execute({
      name,
      email,
      password
    })

    const isPasswordCorrectlyHashed = await compare("password", user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("Should not be able to register with same email", async() => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    await registerUseCase.execute({
      name,
      email,
      password
    })

    await expect(() => registerUseCase.execute({
      name,
      email,
      password
    })).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it("Should be able to register", async() => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } =  await registerUseCase.execute({
      name,
      email,
      password
    })

    expect(user.id).toEqual(expect.any(String))
  })
})