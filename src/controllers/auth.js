import bcrpyt from 'bcrypt'
import User from '../models/users.js'
import { signAccessToken, signRefreshToken, verifyJWT } from '../utils/jwt.js'


// 회원가입
const signUp = async (req, res) => {
    const { name, email } = req.body
    const existingUser = await User.findOne({ email })
    if(existingUser) {
        res.status(400).json({
            message: 'User already exists',
        })
    }

    const password = await new Promise((resolve, reject) => {
        bcrpyt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                reject(err)
            }
            else {
                resolve(hash)
            }
        })
    })
    const user = new User({
        name,
        email,
        password,
    })
    await user.save()

    res.status(201).json({ user })
}

// 로그인
const login = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if(!user) {
        res.json({ message: 'No Such User Found'})
    }

    const isPassword = await bcrpyt.compare(req.body.password, user.password)
    if(!isPassword) {
        res.status(400).json({ message: 'Invalid Password' })
    }

    const payload = {
        email: user.email,
    }
    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)
                
    res.status(200).json({
        accessToken,
        refreshToken,
    })
}

// 매 API요청마다 호출될 함수
const verifyAccessToken = async (req, res, next) => {
    const { accessToken, email } = req.body
    if(!accessToken) {
        res.json({ message: 'No AccessToken' })
    }
    if(accessToken) {
      try {
        const decodeResult = await verifyJWT(accessToken)
        if(decodeResult) {
          const user = await User.findOne({ email })
          if (user) { // accessToken 검증완료 -> req에 값을 세팅 후, next() 호출
            req.user = user
            next()
          }
        }
      } catch (error) { // accessToken 만료 -> client에게 알림
        res.status(400).send({
            message: 'AccessToken expired',
        })
      }
    }
}

// accessToken 재발급 요청시 호출될 함수
const resignAccessToken = async(req, res) => { // accessToken 재발급 필요 -> refreshToken 검증
    const { refreshToken, email } = req.body
    if(!refreshToken) {
        res.json({ message: 'No RefreshToken'})
    }
    if(refreshToken) {
        try {
            const decodeResult = await verifyJWT(refreshToken)
            if(decodeResult) {  // refreshToken 검증완료 -> accessToken 재발급하여 client에게 보냄
                const payload = {
                    email
                }
                const newAccessToken = await signAccessToken(payload)
                res.status(200).json({
                    newAccessToken
                })
            }
        }
        catch(error) {
            res.status(400).json({
                message: 'RefreshToken expired'
            })
        }
    }
}

export { signUp, login, verifyAccessToken, resignAccessToken }