import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import nodemailer from 'nodemailer'
import { getSignature } from '../utils/ncpSens'

dotenv.config()

const SERVICE_ID = process.env.NCP_SERVICE_ID || ''
const ACCESS_KEY = process.env.NCP_ACCESS_KEY || ''
const SECRET_KEY = process.env.NCP_SECRET_KEY || ''
const FROM_NUMBER = process.env.NCP_FROM_NUMBER || ''
const NODEMAILER_ID = process.env.NODEMAILER_ID || ''
const NODEMAILER_PW = process.env.NODEMAILER_PW || ''

const myCache = new NodeCache({ stdTTL: 300 })

// 문자메세지 발송
const sendSMS = async (req: Request, res: Response) => {
    const { phoneNum } = req.body

    const timestamp = Date.now().toString()
    const signature = getSignature(SERVICE_ID, ACCESS_KEY, SECRET_KEY, timestamp)
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`
    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000
    
    myCache.del(phoneNum)
    myCache.set(phoneNum, verifyCode.toString())

    const body = JSON.stringify({
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: FROM_NUMBER,
        content: `인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
            {
                to: phoneNum
            }
        ],
    })
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-ncp-iam-access-key': ACCESS_KEY,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature,
    
        },
        body,
    })

    const result = await response.json()
    if(result.statusCode === '202') {
        return res.status(200).json({
            message: 'SMS 요청 성공'
        })
    }
    else {
        return res.status(400).json({
            message: 'SMS 요청 실패',
        })
    }
}

// SMS 인증번호 검증
const verifySMSCode = (req: Request, res: Response) => {
    const { phoneNum, verifyCode } = req.body

    const cacheValue = myCache.get(phoneNum)
    if(cacheValue===verifyCode) {
        return res.status(200).json({
            message: '인증 완료'
        })
    }
    else {
        return res.status(400).json({
            message: '인증 실패'
        })
    }
}

// 이메일 발송
const sendEmail = async(req: Request, res: Response) => {
    const { email } = req.body // 이메일을 받을 메일 주소

    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000

    myCache.del(email)
    myCache.set(email, verifyCode.toString())

    const transporter = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: {
            user: NODEMAILER_ID,
            pass: NODEMAILER_PW,
        }
    })
    const mailOptions = {
        from: NODEMAILER_ID,
        to: email,
        subject: '테스트',
        text: `인증번호 [${verifyCode}]을 입력해주세요.`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            res.status(400).json({
                message: '이메일 요청 실패'
            })
        }
        else {
            res.status(200).json({
                message: '이메일 요청 성공',
            })
        }
    })
}

// 이메일 인증번호 검증
const verifyEmailCode = async(req: Request, res: Response) => {
    const { email, verifyCode } = req.body

    const cacheValue = myCache.get(email)
    if(cacheValue===verifyCode) {
        return res.status(200).json({
            message: '인증 완료'
        })
    }
    else {
        return res.status(400).json({
            message: '인증 실패'
        })
    }

}

export { sendSMS, verifySMSCode, sendEmail, verifyEmailCode }