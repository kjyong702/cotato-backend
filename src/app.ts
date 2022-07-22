import express from 'express'

import mainRouter from './routers/mainRouter'
import userRouter from './routers/userRouter'
import authRouter from './routers/authRouter'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

export default app