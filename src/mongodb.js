import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const password = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://kjyong702:${password}@cluster1.mtnis.mongodb.net/?retryWrites=true&w=majority`

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
  }
  catch(error) {
    console.log(error)
  }
}

export default connectDB