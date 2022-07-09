import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import mainRouter from './routers/main'
import userRouter from './routers/user'
import authRouter from './routers/auth'

app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

export default app