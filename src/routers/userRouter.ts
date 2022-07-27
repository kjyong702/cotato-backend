import express from 'express'
import { signUp, login, findId, resignAccessToken } from '../controllers/userController'
import { checkToken } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/find-id', findId)
router.post('/refresh', resignAccessToken)

export default router