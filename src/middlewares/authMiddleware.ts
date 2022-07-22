import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../utils/jwt'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const secretKey = process.env.JWT_SECRET_KEY || ''

const prisma = new PrismaClient()

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    const { email, accessToken } = req.body

    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(!user) {
        return res.status(400).json({
            message: 'No Such User Found'
        })
    }

    const isValid = await verifyToken(accessToken, secretKey)
    console.log(isValid)
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

export { checkToken }