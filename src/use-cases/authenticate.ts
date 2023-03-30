import { IUserRepository } from '@/repositories/IUserRepository';
import { compare } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface IAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface IAuthenticateUseCase {
  user: {
    email: string
    password: string
  }
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ email, password }: IAuthenticateUseCaseRequest):  Promise<IAuthenticateUseCase> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return { user }
  }
}