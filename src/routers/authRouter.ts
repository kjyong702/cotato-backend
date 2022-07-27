import express from 'express'
import { sendSMS, verifySMSCode, sendEmail, verifyEmailCode } from '../controllers/authController'

const router = express.Router()

router.post('/SMS/send', sendSMS)
router.post('/SMS/verify', verifySMSCode)
router.post('/email/send', sendEmail)
router.post('/email/verify', verifyEmailCode)

export default router