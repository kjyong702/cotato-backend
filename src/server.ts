import { Request, Response } from 'express';
// import subdomain from 'subdomain'
import app from './app'
import api from './routers/auth'

const PORT = 5000

// app.use(subdomain({ base : 'localhost', removeWWW : true }))
// app.use('/subdomain/api/', api)

const startServer = () => {
    console.log(`The server is listening at port ${PORT}`)
}

app.listen(PORT, startServer)