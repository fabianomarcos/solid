export interface IUser {
  name: string
  email: string
  password: string
  id: string
}

export interface IUserAuthenticated {
  email: string
  password_hash: string
  id: string
}