import app from './app'
// import api from './routers/userRouter'
// import subdomain from 'subdomain'

const PORT = 5000

// app.use(subdomain({ base : 'localhost', removeWWW : true }))
// app.use('/subdomain/api/', api)

const test = () => {
    console.log(`The server is listening at port ${PORT}`)
    
}

app.listen(PORT, test)