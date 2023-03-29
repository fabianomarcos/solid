import { UserAlreadyExistError } from './user-already-exists-error';
import { IUserRepository } from "@/repositories/IUserRepository"
import { hash } from "bcryptjs"

interface IRgisterUserCaseRequest {
    name: string,
    email: string,
    password: string,
}

export class RegisterUseCase {
    constructor(private _userRepository: IUserRepository) {}

    async execute({ email, name, password }: IRgisterUserCaseRequest) {
        const password_hash = await hash(password, 6)
    
        const userWithSameEmail = await this._userRepository.findByEmail(email);
    
        if (userWithSameEmail) throw new UserAlreadyExistError()
    
        await this._userRepository.create({ name, email, password_hash });
    }
}
