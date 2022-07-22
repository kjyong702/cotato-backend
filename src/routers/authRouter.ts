import express from 'express'
import { sendSMS, verifyAuthCode } from '../controllers/authController'

const router = express.Router()

router.post('/send', sendSMS)
router.post('/send/verify', verifyAuthCode)

export default router