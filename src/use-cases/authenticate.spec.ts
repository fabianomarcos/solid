import { compare, hash } from 'bcryptjs';
import { expect, describe, it } from "vitest"

import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe("Authenticate Use Case", () => {
  const email = "jonhdoe@example.com"
  const name = "John Doe"
  const password = "password"

  it("Should be able to authenticate", async() => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name,
      email,
      password_hash: await hash("password", 6)
    })
    const { user } =  await sut.execute({
      email,
      password
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("Should not be able to authenticate with wrong email", async() => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    expect(() => sut.execute({
      email: "fake_email@email.com",
      password
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("Should not be able to authenticate with wrong password", async() => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    expect(sut.execute({
      email,
      password: "123456"
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})