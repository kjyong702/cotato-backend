import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import mainRouter from './routers/main.js'
import userRouter from './routers/user.js'
import authRouter from './routers/auth.js'

app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

export default app