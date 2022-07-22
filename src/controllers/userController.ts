import { Request, Response, NextFunction } from 'express';
import bcrpyt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../utils/jwt'

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET_KEY || ""

const prisma = new PrismaClient()

// 회원가입
const signUp = async (req: Request, res: Response) => {
    const { name, email, phoneNum } = req.body
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })
    if(existingUser) {
        return res.status(400).json({
            message: 'User already exists'
        })
    }

    const password: string = await bcrpyt.hash(req.body.password, 10)
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            phoneNum,
        }
    })
    const accessToken: string = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })

    return res.status(200).json({
        accessToken,
        user,
    })
}

// 로그인
const login = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        return res.status(400).json({
            message: 'No Such User Found'
        })
    }

    const isPassword: boolean = await bcrpyt.compare(req.body.password, user!.password);
    if (!isPassword) {
        return res.status(400).json({
            message: 'Invalid Password'
        })
    }

    const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '14d' });

    return res.status(200).json({
        accessToken,
        refreshToken,
    })
}

// 핸드폰 인증 필요?
const findId = async (req: Request, res: Response) => {
    const { phoneNum } = req.body
    const user = await prisma.user.findUnique({
        where: { phoneNum },
    })
    if(!user) {
        return res.status(400).json({
            message: 'No Such User Found'
        })
    }

    const { email } = user

    return res.status(200).json({
        email,
    })
}

// const findPassword = async(req: Request, res: Response) => {
//     // 핸드폰(NCP SENS) or 이메일(nodemailer) 인증 과정 추가

// }

const resignAccessToken = async(req: Request, res: Response) => {
    const { email, refreshToken } = req.body
    if(!refreshToken) {
        return res.status(400).json({
            message: 'No refreshToken'
        })
    }
    
    const isValid: boolean = await verifyToken(refreshToken, SECRET_KEY)
    if(!isValid) {
        return res.status(400).json({
            message: 'refreshToken expired'
        })
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(!user) {
        return res.status(400).json({
            message: 'No Such User Found'
        })
    }

    const newAccessToken = jwt.sign({ userId: user.id}, SECRET_KEY, { expiresIn: '1h' })

    return res.status(200).json({
        newAccessToken,
    })
}

export { signUp, login, findId, resignAccessToken }