import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from "vitest"

import { IUser } from '@/interfaces/types';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe("Authenticate Use Case", () => {
  const email = "jonhdoe@example.com"
  const name = "John Doe"
  const password = "password"

  let userRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase
  let _user: IUser

  beforeEach(async () => {

    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { user } =  await sut.execute({
      email,
      password
    })

    _user = user
  })

  it("Should be able to authenticate", async() => {
    expect(_user.id).toEqual(expect.any(String))
  })

  it("Should not be able to authenticate with wrong email", async() => {
    expect(() => sut.execute({
      email: "fake_email@email.com",
      password
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("Should not be able to authenticate with wrong password", async() => {
    expect(sut.execute({
      email,
      password: "123456"
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})