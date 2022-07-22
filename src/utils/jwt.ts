import jwt from 'jsonwebtoken'

const verifyToken = async (token: string, secretKey: string) => {
    try {
        jwt.verify(token, secretKey)
        return true
    } catch {
        return false
    }
}

export { verifyToken }