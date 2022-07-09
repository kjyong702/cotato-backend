import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret : string = process.env.SERVER_SECRET as string

// jwt.sign()을 동기적으로 쓸 거면 그냥 써도 되는데 비동기적으로 사용할려면 뒤에 콜백함수를 넣어야하고 Promise return 필요
async function signAccessToken(value : any) {
  return new Promise((resolve, reject) => {
    jwt.sign(value, secret, {expiresIn: '1h'}, (err, token) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(token)
      }
    })
  })
}

async function signRefreshToken(value : any) {
  return new Promise((resolve, reject) => {
    jwt.sign(value, secret, {expiresIn: '14d'}, (err, token) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(token)
      }
    })
  })
}

async function verifyJWT(token : any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(decoded)
      }
    })
  })
}

 export { signAccessToken, signRefreshToken, verifyJWT }