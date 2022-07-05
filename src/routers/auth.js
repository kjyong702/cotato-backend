import express from 'express'
import { signUp, login, resignAccessToken } from '../controllers/auth.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/refresh', resignAccessToken)

export default router