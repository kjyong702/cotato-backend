import express from 'express'
import { verifyAccessToken } from '../controllers/auth.js'

const router = express.Router()

router.post('/profile', verifyAccessToken, (req, res) => {
    res.status(200).json({
        message: 'Valid AccessToken'
    })
})

export default router