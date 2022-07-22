interface IUser{
    id: number
    name: string
    email: string
    password: string
    phoneNum: string
    createdAt: any
    updatedAt: any
}

declare namespace Express {
    export interface Request {
        user: IUser | null
    }
}