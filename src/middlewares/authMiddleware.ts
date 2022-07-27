import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../utils/jwt'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const secretKey = process.env.JWT_SECRET_KEY || ''

const prisma = new PrismaClient()

// 유저의 액세스 토큰 검증 -> req.headers로 받음
const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body

    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(!user) {
        return res.status(400).json({
            message: 'No Such User Found'
        })
    }

    if(req.headers.authorization) {
        const accessToken = req.headers.authorization.split('Bearer ')[1]

        const isValid = await verifyToken(accessToken, secretKey)
        if(isValid) {
            req.user= user
            return next()
        }
        else {
            return res.status(400).json({
                message: 'AccessToken Expired'
            })
        }
    }
}

export { checkToken }