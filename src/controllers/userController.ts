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

    const password = await bcrpyt.hash(req.body.password, 10)
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            phoneNum,
        }
    })
    const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ userId: user.id}, SECRET_KEY, { expiresIn: '14d' })

    return res.status(200).json({
        accessToken,
        refreshToken,
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

    const isPassword = await bcrpyt.compare(req.body.password, user.password)
    console.log(req.body.password, user.password)
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

// 아이디 찾기
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

// 비밀번호 재설정
// 보통 비밀번호 찾기는 아이디가 존재하는지 검증하고 전화번호 인증으로 넘어가는데 이 때 요청 순서가 어케되는지?
// 먼저 해당 아이디의 유저가 존재하는지를 검사해주고 SMS인증하고 비밀번호를 send해줘야하는데 프론트에서 동시에 여러 요청이 되나?
// 아니면 먼저 비밀번호를 프론트에 던져주고 SMS인증이 통과하면 프론트에서 화면에 표시? 값(비밀번호)을 프론트에서 저장해 둘 수 있나?
const findPassword = async(req: Request, res: Response) => {
    const { email } = req.body
    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(!user) {
        res.status(200).json({
            message: 'No Such User Found'
        })
    }


}

// accessToken 재발급
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