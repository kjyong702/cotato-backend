import express from 'express'
// import subdomain from 'express-subdomain'
import { signUp, login, findId, resignAccessToken } from '../controllers/userController'
import { checkToken } from '../middlewares/authMiddleware'

const router = express.Router()

// router.use(subdomain('api', router))

router.post('/signup', signUp)
router.post('/login', login)
router.post('/find-id', checkToken, findId)
router.post('/refresh', resignAccessToken)

export default router