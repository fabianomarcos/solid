import { UserAlreadyExistError } from './errors/user-already-exists-error';
import { IUserRepository } from "@/repositories/user-repository"
import { hash } from "bcryptjs"

interface IRegisterUserCaseRequest {
    name: string,
    email: string,
    password: string,
}

export class RegisterUseCase {
    constructor(private _userRepository: IUserRepository) {}

    async execute({ email, name, password }: IRegisterUserCaseRequest) {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this._userRepository.findByEmail(email);

        if (userWithSameEmail) throw new UserAlreadyExistError()

        const user = await this._userRepository.create({ name, email, password_hash });

        return { user }
    }
}
