import subdomain from 'subdomain'
import app from './app.js'
import api from './routers/auth.js'
import connectDB from './mongodb.js'

const PORT = 5000

app.use(subdomain({ base : 'localhost', removeWWW : true }))
app.use('/subdomain/api/', api)

connectDB()

app.listen(PORT, (req, res) => {
    console.log(`The server is listening at port ${PORT}`)
})